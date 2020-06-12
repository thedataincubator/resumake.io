/**
 * @flow
 */

import { initialState as formInitialState } from '../form/reducer'
import type { Action } from '../../app/types'

// TODO: not typeizing yet

const initialState = {
  fellowData: null
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

    default:
      return state
  }
}

export default tdi
