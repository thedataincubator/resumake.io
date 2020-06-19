/**
 * @flow
 */

import { hasPrevSession } from '../../app/selectors'
import { previewMatchesFellowData, hasNoFellowData } from './selectors'
import { isEqual } from 'lodash'
import { reset } from 'redux-form'
import type { Action, AsyncAction } from '../../app/types'
import { FormValuesWithSectionOrder } from '../form/types'
import { clearState } from '../../app/actions'
import { generateResume } from '../../features/preview/actions'

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

function fetchFellowData(fellowKeyUrlsafe: ?string): AsyncAction {
  return async (dispatch, getState) => {
    const state = getState()
    const { fetch } = window
    try {
      const fellowDataFetchBaseUrl = '/fellows/fetch_resume_json'
      const fellowDataFetchUrl = fellowKeyUrlsafe ? fellowDataFetchBaseUrl + '/' + fellowKeyUrlsafe : fellowDataFetchBaseUrl
      const response = await fetch(fellowDataFetchUrl)
      const responseData = await response.json()
      if (!response.ok) {
        alert(responseData.errors.join('\n'))
        return
      }
      const fellowData = responseData
      dispatch(updateSavedFellowData(fellowData))
    } catch (err) {
      alert(err.message)
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
      await fetch(updateFellowDataUrl, request)
      dispatch(updateSavedFellowData(resumeData))
      return true
    } catch (err) {
      alert('errored out')
      console.log(err)
      return false
    }
  }
}

export function fetchFellowDataAndResetFormToIt(): AsyncAction {
  // ResetForm_And_Preview, actually.
  return async (dispatch, getState) => {
    const { fellowKeyUrlsafe } = getState().tdi
    await dispatch(fetchFellowData())
    dispatch(reset('resume'))
    const { fellowData } = getState().tdi
    await dispatch(generateResume(fellowData))
  }
}

export function publishPDF(): AsyncAction {
  return async (dispatch, getState) => {

    const state = getState()
    const fellowKeyUrlsafe = state.tdi.fellowKeyUrlsafe

    const {
      data: {
        json: previewData
      },
      resume: {
        url: blobUrl
      }
    } = state.preview
    const {
      fellowData: tdiFellowData
    } = state.tdi

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
          alert(responseData.errors.join('\n'))
        }
      } catch (err) {
        alert(err.message)
      }
    }

  }
}

export function initializeApplication(fellowKeyUrlsafe: ?string, history: RouterHistory): AsyncAction {
  return async (dispatch, getState) => {
    if (!fellowKeyUrlsafe) { // Not an admin. Just fetch the data.
      history.push('/resumake/generator')
      // I load fellow data only when the generator page is loaded. Otherwise, redux-form will pick
      // up our data when initializing the form instead of the json which was just uploaded.
      // (Yes, our integration with redux-form is tighter than the authors!)
      return
    }
    // In case of admins, we should purge the state first and start from scratch.
    alert(`Application will reset and the resume data for the Fellow with id ${fellowKeyUrlsafe} will be loaded`)
    dispatch(clearState())
    await dispatch(fetchFellowData(fellowKeyUrlsafe))
    if (hasNoFellowData(getState())) {
      return
    }
    dispatch(storeFellowKeyUrlsafe(fellowKeyUrlsafe))
    history.push('/resumake/generator')
  }
}
