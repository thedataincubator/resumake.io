/**
 * @flow
 */

import { isEqual } from 'lodash'
import { reset } from 'redux-form'
import type { Action, AsyncAction } from '../../app/types'
import { FormValuesWithSectionOrder } from '../form/types'
import { clearState } from '../../app/actions'

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
    const { fetch } = window
    try {
      const jsonresumeFetchUrl = '/fellows/fetch_resume_json'
      const response = await fetch(jsonresumeFetchUrl)
      const fellowData = await response.json()
      dispatch(updateSavedFellowData(fellowData))
    } catch (err) {
      // TODO: error handling!
      alert('errored out')
      console.log(err)
    }
  }
}

// NOTE: I'd rather duplicate fetchFellowData while a strong similarity becomes
// apparent. I'm mainly trying to keep some headroom for diverging error-handling
// in case of admins.
function fetchFellowDataWithKey(fellowKeyUrlsafe: string): AsyncAction {
  return async (dispatch, getState) => {
    const { fetch } = window
    try {
      const jsonresumeFetchBaseUrl = '/fellows/fetch_resume_json'
      const jsonresumeFetchUrl = jsonresumeFetchBaseUrl + '/' + fellowKeyUrlsafe
      const response = await fetch(jsonresumeFetchUrl)
      const fellowData = await response.json()
      dispatch(updateSavedFellowData(fellowData))
    } catch (err) {
      // TODO: error handling!
      alert('errored out')
      console.log(err)
    }
  }
}

export function saveFellowData(resumeData: FormValuesWithSectionOrder): AsyncAction {
  return async (dispatch, getState) => {
    // Inconsistent with the fact that I'm using separate fetch action for when the key is available...
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
    } catch (err) {
      alert('errored out')
      console.log(err)
    }
  }
}

function shouldFetchFellowData(tdiState) {
  if (tdiState.fellowData) {
    return false
  }
  return true
}

export function fetchIfNeededAndResetFormToSavedState(): AsyncAction {
  return async (dispatch, getState) => {
    if (shouldFetchFellowData(getState().tdi)) {
      await dispatch(fetchFellowData())
    }
    dispatch(reset('resume'))
  }
}

export function publishPDF(): AsyncAction {
  return async (dispatch, getState) => {

    const fellowKeyUrlsafe = getState().tdi.fellowKeyUrlsafe

    const { 
      data: {
        json: previewData
      },
      resume: {
        url: blobUrl
      }
    } = getState().preview
    const {
      fellowData: tdiFellowData
    } = getState().tdi

    // Previewed resume data should be same as what's saved.
    if (isEqual(previewData, tdiFellowData)) {

      const { confirm } = window

      if (!confirm('The displayed resume will be published on the Resume Book')) {
        return
      }
      
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

    } else {
      alert('Preview data does not match saved values. Reset values, re-render and make sure the resume looks good before publishing.')
    }
    
  }
}

export function initializeApplication(history: RouterHistory, fellowKeyUrlsafe: ?string): AsyncAction {
  return async (dispatch, getState) => {
    if (!fellowKeyUrlsafe) { // Not an admin.
      return
    }
    // Admin
    alert(`Application will reset and the resume data for the Fellow with id ${fellowKeyUrlsafe} will be loaded`)
    dispatch(clearState())
    await dispatch(fetchFellowDataWithKey(fellowKeyUrlsafe))
    dispatch(storeFellowKeyUrlsafe(fellowKeyUrlsafe))
    dispatch(reset('resume'))
    history.push('/resumake/generator')
  }
}
