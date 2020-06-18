/**
 * @flow
 */

import { isEqual } from 'lodash'
import type { State } from '../../app/types'

export function previewMatchesFellowData(state: State): boolean {
  return isEqual(state.preview.data.json, state.tdi.fellowData)
}
