/**
 * @flow
 */

import { reset } from 'redux-form'
import type { Action, AsyncAction } from '../../app/types'
import { FormValuesWithSectionOrder } from '../form/types'

function updateSavedFellowData(fellowData): Action {
  return {
    type: 'UPDATE_FELLOW_DATA',
    fellowData
  }
}

export function fetchFellowData(): AsyncAction {
  return async (dispatch, getState) => {
    // TODO: redux-ize below action and integrate into the application
    // NOTE: fellowKeyUrlsafe will come from the state, in case of admins
    const fellowKeyUrlsafe = undefined // 'aghkZXZ-Tm9uZXITCxIGRmVsbG93GICAgICAgIELDA'
    const { fetch } = window
    try {
      const jsonresumeFetchBaseUrl = '/fellows/fetch_resume_json'
      const jsonresumeFetchUrl = fellowKeyUrlsafe ? jsonresumeFetchBaseUrl + '/' + fellowKeyUrlsafe : jsonresumeFetchBaseUrl
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
    const fellowKeyUrlsafe = undefined
    const { fetch } = window
    const request = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(resumeData)
    }
    try {
      await fetch('/fellows/update_resume_json', request)
      // TODO
    } catch (err) {
      alert('errored out')
      console.log(err)
    }
  }
}

function resetFormToFellowData(fellowData): Action {
  // I'm very explicit in naming this reducer, since the form
  // is usually managed by redux-form.
  return {
    type: 'RESET_FORM_VALUES_MANUALLY',
    formValues: fellowData
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
    // dispatch(resetFormToFellowData(getState().tdi.fellowData))
    dispatch(reset('resume'))
  }
}
