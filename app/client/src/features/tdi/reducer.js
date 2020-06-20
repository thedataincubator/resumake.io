/**
 * @flow
 */

import { initialState as formInitialState } from '../form/reducer'

// TODO: not typeizing yet

export const initialState = {
  fellowData: null,
  fellowKeyUrlsafe: undefined
}

function tdi(state = initialState, action) {
  switch (action.type) {
    case 'UPDATE_FELLOW_DATA':
      return {
        ...state,
        fellowData: {
          ...formInitialState.values,
          ...action.fellowData
        }
      }

    case 'STORE_FELLOW_KEY':
      return {
        ...state,
        fellowKeyUrlsafe: action.fellowKeyUrlsafe
      }

    default:
      return state
  }
}

export default tdi
