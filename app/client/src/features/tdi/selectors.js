/**
 * @flow
 */

import { isEqual } from 'lodash'
import type { State } from '../../app/types'
import { hasPrevSession } from '../../app/selectors'
import { initialState } from './reducer'

export function hasNoFellowData(state: State): boolean {
  return isEqual(initialState.fellowData, state.tdi.fellowData)
}

export function previewMatchesFellowData(state: State): boolean {
  return isEqual(state.preview.data.json, state.tdi.fellowData)
}

export function previewMatchesFormData(state: State): boolean {
  return isEqual(state.preview.data.json, state.form.resume.values)
}

export function mayResetFormToFellowData(state: State): boolean {
  // Empty session and empty fellow data
  if (hasPrevSession(state)) return false
  if (!hasNoFellowData(state)) return false
  return true
}
