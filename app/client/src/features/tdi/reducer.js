/**
 * @flow
 */

import { initialState as formInitialState } from '../form/reducer'
import { initialState as progressInitialState } from '../progress/reducer'
import type { Action } from '../../app/types'

// TODO: not typeizing yet

const initialFormValues = formInitialState.values
const initialSections = progressInitialState.sections

export const initialState = {
  fellowData: {
    ...initialFormValues,
    sections: initialSections
  }, // NOTE: this is FormValuesWithSectionOrder!
  fellowKeyUrlsafe: undefined
}

function tdi(state = initialState, action) {
  switch (action.type) {
    case 'UPDATE_FELLOW_DATA':
      return {
        ...state,
        fellowData: {
          // NOTE: initial form and section values protect us from empty {} server responses.
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
