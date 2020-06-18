/**
 * @flow
 */

import React from 'react'
import { Swap, Button, Row } from '../../../../common/components'
import LabeledInput from './LabeledInput'

type Props = {
  index: number,
  canRemove: boolean,
  removeSchool: (index: number) => void,
  swapSchools: (index: number) => void
}

function School({ index, canRemove, removeSchool, swapSchools }: Props) {
  return (
    <div>
      {index > 0
        ? <Swap onClick={() => swapSchools(index)} />
        : null}
      <Row>
        <LabeledInput
          name={`education[${index}].institution`}
          label="School Name"
          placeholder="Stanford University"
        />
        <Button
          onClick={() => removeSchool(index)}
          disabled={!canRemove}
          type="button"
        >
          Remove School
        </Button>
      </Row>
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
