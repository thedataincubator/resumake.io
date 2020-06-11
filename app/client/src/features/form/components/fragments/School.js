/**
 * @flow
 */

import React from 'react'
import { Divider } from '../../../../common/components'
import LabeledInput from './LabeledInput'

type Props = {
  index: number
}

function School({ index }: Props) {
  return (
    <div>
      {index > 0 ? <Divider /> : null}
      <LabeledInput
        name={`education[${index}].institution`}
        label="School Name"
        placeholder="Stanford University"
      />
      <LabeledInput
        name={`education[${index}].studyType`}
        label="Degree"
        placeholder="BS"
      />
      <LabeledInput
        name={`education[${index}].area`}
        label="Major"
        placeholder="Computer Science"
      />
      <LabeledInput
        name={`education[${index}].endDate`}
        label="Completion Date"
        placeholder="Jun 2019"
      />
    </div>
  )
}

export default School
