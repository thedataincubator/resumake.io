/**
 * @flow
 */

import { initialState as formInitialState } from '../form/reducer'
import { initialState as progressInitialState } from '../progress/reducer'
import type { Action } from '../../app/types'

// TODO: not typeizing yet

export const initialState = {
  fellowData: null, // NOTE: this is FormValuesWithSectionOrder!
  fellowKeyUrlsafe: undefined
}

const initialFormValues = formInitialState.values
const initialSections = progressInitialState.sections

function tdi(state = initialState, action) {
  switch (action.type) {
    case 'UPDATE_FELLOW_DATA':
      return {
        ...state,
        fellowData: {
          ...initialFormValues,
          sections: initialSections,
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
