/**
 * @flow
 */

import { toast } from 'react-toastify'
import { hasPrevSession } from '../../app/selectors'
import { previewMatchesFellowData, hasNoFellowData } from './selectors'
import { isEqual } from 'lodash'
import { reset } from 'redux-form'
import type { Action, AsyncAction } from '../../app/types'
import { FormValuesWithSectionOrder } from '../form/types'
import { clearState } from '../../app/actions'
import { generateResume } from '../../features/preview/actions'

/**
 * NOTE: presentation layer (in this case - react toast) should not seep into
 * state layer.
 * Ideally, we should write request status flags like e.g. GENERATE_RESUME_REQUEST and GENERATE_RESUME_FAILURE
 * already do and derive presentation from there.
 * For now, I'll just sprinkle around some toast calls as a (hopefully) temporary band-aid.
 */
const TOAST_INFO_OPTS = {
  type: 'info',
  position: toast.POSITION.TOP_RIGHT,
  hideProgressBar: true,
  closeButton: false,
  autoClose: 3000
}
const TOAST_ERROR_OPTS = {
  type: 'error',
  position: toast.POSITION.TOP_RIGHT,
  hideProgressBar: true,
  closeButton: false,
  autoClose: 3000
}


function updateSavedFellowData(fellowData): Action {
  return {
    type: 'UPDATE_FELLOW_DATA',
    fellowData
  }
}

function storeFellowKeyUrlsafe(fellowKeyUrlsafe: string): Action {
  return {
    type: 'STORE_FELLOW_KEY',
    fellowKeyUrlsafe
  }
}

function fetchFellowData(): AsyncAction {
  return async (dispatch, getState) => {
    const { fellowKeyUrlsafe } = getState().tdi
    const { fetch } = window
    try {
      const fellowDataFetchBaseUrl = '/fellows/fetch_resume_json'
      const fellowDataFetchUrl = fellowKeyUrlsafe ? fellowDataFetchBaseUrl + '/' + fellowKeyUrlsafe : fellowDataFetchBaseUrl
      const response = await fetch(fellowDataFetchUrl)
      const responseData = await response.json()
      if (!response.ok) {
        toast(responseData.errors.join('. '), TOAST_ERROR_OPTS)
        return false
      }
      const fellowData = responseData
      toast('Data loaded.', TOAST_INFO_OPTS)
      dispatch(updateSavedFellowData(fellowData))
      return true
    } catch (err) {
      toast(err.message, TOAST_ERROR_OPTS)
      return false
    }
  }
}

export function saveFellowData(resumeData: FormValuesWithSectionOrder): AsyncAction {
  return async (dispatch, getState) => {
    const fellowKeyUrlsafe = getState().tdi.fellowKeyUrlsafe
    const { fetch } = window
    const request = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(resumeData)
    }
    try {
      const updateFellowDataUrl = fellowKeyUrlsafe ? '/fellows/update_resume_json/' + fellowKeyUrlsafe : '/fellows/update_resume_json'
      const resp = await fetch(updateFellowDataUrl, request)
      if (!resp.ok) {
        const respObj = await resp.json()
        toast(respObj.errors.join('. '), TOAST_ERROR_OPTS)
        return false
      }
      dispatch(updateSavedFellowData(resumeData))
      toast('Data saved.', TOAST_INFO_OPTS)
      return true
    } catch (err) {
      toast(err.message, TOAST_ERROR_OPTS)
      return false
    }
  }
}

export function fetchFellowDataAndResetFormToIt(): AsyncAction {
  // ResetForm_And_Preview, actually.
  return async (dispatch, getState) => {
    const { fellowKeyUrlsafe } = getState().tdi
    const success = await dispatch(fetchFellowData())
    if (!success) {
      return
    }
    dispatch(reset('resume'))
    const { fellowData } = getState().tdi
    await dispatch(generateResume(fellowData))
  }
}

export function publishPDF(): AsyncAction {
  return async (dispatch, getState) => {

    const state = getState()
    const fellowKeyUrlsafe = state.tdi.fellowKeyUrlsafe

    const { resume: { url: blobUrl } } = state.preview
    const { fellowData: tdiFellowData } = state.tdi

    const { confirm } = window
    if (!confirm('The displayed resume will be published on the Resume Book')) {
      return
    }

    let saved = true
    // Save the resume data that's currently displayed
    if (!previewMatchesFellowData(state)) { //
      saved = await dispatch(saveFellowData(state.form.resume.values))
    }

    if (saved) {
      const { fetch } = window

      const blob = await fetch(blobUrl).then(res => res.blob())

      const data = new FormData()
      data.append('resume', blob, 'resume.pdf')

      const request = {
        method: 'POST',
        body: data
      }

      try {
        const publishPDFBaseUrl = '/fellows/update_resume'
        const publishPDFUrl = fellowKeyUrlsafe ? publishPDFBaseUrl + '/' + fellowKeyUrlsafe : publishPDFBaseUrl
        const response = await fetch(publishPDFUrl, request)
        if (!response.ok) {
          const responseData = await response.json()
          toast(responseData.errors.join('. '), TOAST_ERROR_OPTS)
          return
        }
        toast('Resume Published.', TOAST_INFO_OPTS)
      } catch (err) {
        toast(err.message, TOAST_ERROR_OPTS)
      }
    }

  }
}

export function initializeApplication(fellowKeyUrlsafe: ?string, history: RouterHistory): AsyncAction {
  return async (dispatch, getState) => {
    if (fellowKeyUrlsafe) { // An admin.
      // For admins, we should purge the state and start from scratch when starting to edit
      // a new/different Fellow resume than the previous one.
      const { fellowKeyUrlsafe: prevFellowKey } = getState().tdi
      if (prevFellowKey !== fellowKeyUrlsafe) {
        alert(`Resetting the application and loading Fellow ${fellowKeyUrlsafe} data.`)
        dispatch(clearState())
        dispatch(storeFellowKeyUrlsafe(fellowKeyUrlsafe))
      }
    }
    history.push('/resumake/generator')
  }
}
