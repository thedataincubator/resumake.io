/**
 * @flow
 */

import type { AppAction as Action } from './types'

function clearState(): Action {
  return {
    type: 'CLEAR_STATE'
  }
}

// ********************************************
// start - TDI actions

function initializeFellowData(fellowKeyUrlsafe: ?string): AsyncAction {
  return async (dispatch, getState) => {
    // TODO: redux-ize below action and integrate into the application
    const { fetch } = window
    try {
      const jsonresumeFetchBaseUrl = '/fellows/fetch_resume_json'
      const jsonresumeFetchUrl = fellowKeyUrlsafe ? jsonresumeFetchBaseUrl + '/' + fellowKeyUrlsafe : jsonresumeFetchBaseUrl
      const response = await fetch(jsonresumeFetchUrl)
      const fellowData = await response.json()
      alert(`Fetched fellow data: ${JSON.stringify(fellowData)}`)
    } catch (err) {
      alert('errored out')
      console.log(err)
    }
  }
}

// ********************************************
// end - TDI actions

export { clearState, initializeFellowData }
