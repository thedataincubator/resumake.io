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

function initializeFellowJsonresume(fellowKeyUrlsafe: ?string): AsyncAction {
  return async (dispatch, getState) => {
    // TODO: redux-ize below action and integrate into the application
    const { fetch } = window
    const request = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      // body: JSON.stringify(resumeData),
    }

    try {
      fellowKeyUrlsafe
      const jsonresumeFetchBaseUrl = '/fellows/fetch_resume_json'
      const jsonresumeFetchUrl = fellowKeyUrlsafe ? jsonresumeFetchBaseUrl + '/' + fellowKeyUrlsafe : jsonresumeFetchBaseUrl
      const response = await fetch(jsonresumeFetchUrl, request)
      const responseText = await response.text()
      alert(`Fetched jsonresume: ${responseText}`)
    } catch (err) {
      alert('errored out')
      console.log(err)
    }
  }
}

// ********************************************
// end - TDI actions

export { clearState, initializeFellowJsonresume }
