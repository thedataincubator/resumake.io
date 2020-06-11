/**
 * @flow
 */

import type { Action, AsyncAction } from '../../app/types'

function fetchFellowData(): AsyncAction {
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
      alert(`Fetched fellow data: ${JSON.stringify(fellowData)}`)
    //   dispatch(fetchFellowDataSuccess(fellowData))
    } catch (err) {
      alert('errored out')
      console.log(err)
    }
  }
}

export { fetchFellowData }
