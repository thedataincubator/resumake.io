/**
 * @flow
 */

import type { Action } from '../../app/types'

function tdi(state = {}, action) {
  switch (action.type) {
    case 'FETCH_FELLOW_DATA_SUCCESS':
      return {
        ...state,
        fellowData: action.fellowData
      }

    default:
      return state
  }
}

export default tdi
