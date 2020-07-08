/**
 * @flow
 */

import React from 'react'
import { toast } from 'react-toastify'
import { previewMatchesFellowData, sectionOrderFromFellowData } from './selectors'
import type { Action, AsyncAction, State } from '../../app/types'
import { FormValuesWithSectionOrder } from '../form/types'
import { clearState } from '../../app/actions'
import { generateResume } from '../../features/preview/actions'
import { setSectionOrder } from '../../features/progress/actions'
import { uploadJSONSuccess } from '../form/actions'
import AuthToast from './components/AuthToast'

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
  closeButton: true,
  autoClose: false
}
const TOAST_LOGIN_OPTS = {
  ...TOAST_ERROR_OPTS,
  closeOnClick: false,
}


function setWorking(working) {
  const body: any = document.body
  if (working)
    body.classList.add('working')
  else
    body.classList.remove('working')
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

function parseError(error) {
  if (error.errors !== undefined) {
    try {
      return error.errors.join('. ')
    } catch (err) {
      return error.errors
    }
  }
  return error.message
}

async function handleAuthError(response) {
  if (response.status === 401) {
    // Not logged in
    try {
      const responseData = await response.json()
      toast(<AuthToast loginURL={responseData.loginURL} />, TOAST_LOGIN_OPTS)
    } catch (err) {
      toast('Could not authenticate you.  Contact TDI staff for assistance.', TOAST_ERROR_OPTS)
    }
    return true
  }
  if (response.status === 403) {
    // Are logged in, but we don't like you
    try {
      const responseData = await response.json()
      toast(parseError(responseData), TOAST_ERROR_OPTS)
    } catch (err) {
      toast('Could not authenticate you.  Contact TDI staff for assistance.', TOAST_ERROR_OPTS)
    }
    return true
  }
  return false
}

function fetchFellowData(): AsyncAction {
  return async (dispatch, getState) => {
    const { fellowKeyUrlsafe } = getState().tdi
    const { fetch } = window
    setWorking(true)
    try {
      const fellowDataFetchBaseUrl = '/fellows/fetch_resume_json'
      const fellowDataFetchUrl = fellowKeyUrlsafe ? fellowDataFetchBaseUrl + '/' + fellowKeyUrlsafe : fellowDataFetchBaseUrl
      const response = await fetch(fellowDataFetchUrl)
      if (await handleAuthError(response)) {
        return false
      }
      const responseData = await response.json()
      if (!response.ok) {
        toast(parseError(responseData), TOAST_ERROR_OPTS)
        return false
      }
      const fellowData = responseData
      toast('Resume data loaded.', TOAST_INFO_OPTS)
      dispatch(updateSavedFellowData(fellowData))
      return true
    } catch (err) {
      toast(err.message, TOAST_ERROR_OPTS)
      return false
    } finally {
      setWorking(false)
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
    setWorking(true)
    try {
      const updateFellowDataUrl = fellowKeyUrlsafe ? '/fellows/update_resume_json/' + fellowKeyUrlsafe : '/fellows/update_resume_json'
      const resp = await fetch(updateFellowDataUrl, request)
      if (await handleAuthError(resp)) {
        return false
      }
      if (!resp.ok) {
        const respObj = await resp.json()
        toast(parseError(respObj), TOAST_ERROR_OPTS)
        return false
      }
      dispatch(updateSavedFellowData(resumeData))
      toast('Resume data saved.', TOAST_INFO_OPTS)
      return true
    } catch (err) {
      toast(err.message, TOAST_ERROR_OPTS)
      return false
    } finally {
      setWorking(false)
    }
  }
}

export function fetchFellowDataAndResetFormToIt(): AsyncAction {
  // ResetForm_And_Preview, actually.
  return async (dispatch, getState) => {
    const success = await dispatch(fetchFellowData())
    if (!success) {
      return
    }
    const state = getState()
    // Reuse the JSON upload machinery to reset the form data.  Note that this
    // also sets jsonUpload: "success", but that shouldn't hurt anything.
    dispatch(uploadJSONSuccess(state.tdi.fellowData))
    // NOTE: we can hard code arbitrary section since we ditched the progress bar anyways.
    dispatch(setSectionOrder(sectionOrderFromFellowData(state, 'templates')))
    await dispatch(generateResume(state.tdi.fellowData))
  }
}

export function publishPDF(): AsyncAction {
  return async (dispatch, getState) => {

    const state: State = getState()
    const fellowKeyUrlsafe = state.tdi.fellowKeyUrlsafe

    const {
      resume: { url: blobUrl },
      form: { resume: { values } },
      progress: { sections }
    } = state.preview

    const { confirm } = window
    if (!confirm('The displayed resume will be published on the Resume Book')) {
      return
    }

    let saved = true
    // Save the resume data that's currently displayed
    if (!previewMatchesFellowData(state)) { //
      saved = await dispatch(saveFellowData({ sections, ...values }))
    }

    if (saved) {
      const { fetch, FormData } = window

      const blob = await fetch(blobUrl).then(res => res.blob())

      const data = new FormData()
      data.append('resume', blob, 'resume.pdf')

      const request = {
        method: 'POST',
        body: data
      }

      setWorking(true)
      try {
        const publishPDFBaseUrl = '/fellows/update_resume'
        const publishPDFUrl = fellowKeyUrlsafe ? publishPDFBaseUrl + '/' + fellowKeyUrlsafe : publishPDFBaseUrl
        const response = await fetch(publishPDFUrl, request)
        if (await handleAuthError(response)) {
          return
        }
        if (!response.ok) {
          const responseData = await response.json()
          toast(parseError(responseData), TOAST_ERROR_OPTS)
          return
        }
        toast('Resume published to resume book.', TOAST_INFO_OPTS)
      } catch (err) {
        toast(err.message, TOAST_ERROR_OPTS)
      } finally {
        setWorking(false)
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
        window.alert(`Resetting the application and loading Fellow ${fellowKeyUrlsafe} data.`)
        dispatch(clearState())
        dispatch(storeFellowKeyUrlsafe(fellowKeyUrlsafe))
      }
    }
    history.push('/resumake/generator')
  }
}
