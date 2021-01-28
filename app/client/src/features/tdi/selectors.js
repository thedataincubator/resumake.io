/**
 * @flow
 */

import { isEqual } from 'lodash'
import type { State } from '../../app/types'
import { FormValues } from '../form/types'
import { Section } from '../../common/types'
import { hasPrevSession } from '../../app/selectors'
import { initialState } from './reducer'

export function hasNoFellowData(state: State): boolean {
  return isEqual(initialState.fellowData, state.tdi.fellowData)
}

export function previewMatchesFellowData(state: State): boolean {
  return isEqual(state.preview.data.json, state.tdi.fellowData)
}

export function previewMatchesFormData(state: State): boolean {
  const formValuesWithSectionOrder = {
    ...state.form.resume.values,
    sections: state.progress.sections
  }
  return isEqual(state.preview.data.json, formValuesWithSectionOrder)
}

export function mayResetFormToFellowData(state: State): boolean {
  // Empty session and empty fellow data
  if (hasPrevSession(state)) return false
  if (!hasNoFellowData(state)) return false
  return true
}

export function formValuesFromFellowData(state: State): FormValues {
  const {
    sections,
    ...fellowData
  } = state.tdi.fellowData
  return fellowData
}

export function sectionOrderFromFellowData(state: State): Array<Section> {
  return state.tdi.fellowData.sections
}
