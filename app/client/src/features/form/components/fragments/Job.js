/**
 * @flow
 */

import React from 'react'
import styled from 'styled-components'
import { Divider, RoundButton, Icon, Row } from '../../../../common/components'
import LabeledInput, { Label, Input } from './LabeledInput'


const ButtonRow = styled.div`
  display: inline-flex;
  justify-content: flex-end;
  align-items: center;
  margin-left: 15px;
  ${props => props.hidden && 'opacity: 0;'} transition: none;
`

const MiniInput = Input.extend`
  width: 65%;

  @media screen and (max-width: 850px) {
    width: 65%;
  }
`

type Props = {
  highlights: Array<?string>,
  index: number,
  addHighlight: (index: number) => void,
  removeHighlight: (index: number) => void
}

function Job({ highlights, index, addHighlight, removeHighlight }: Props) {
  return (
    <div>
      {index > 0 ? <Divider /> : null}
      <LabeledInput
        name={`work[${index}].company`}
        label="Company Name"
        placeholder="Google"
      />
      <LabeledInput
        name={`work[${index}].position`}
        label="Job Title"
        placeholder="Software Engineer"
      />
      <LabeledInput
        name={`work[${index}].startDate`}
        label="Start Date"
        placeholder="May 2015"
      />
      <LabeledInput
        name={`work[${index}].endDate`}
        label="End Date"
        placeholder="May 2017 / Present"
      />
      <Label>Job Responsibilities</Label>
      {highlights.map((highlight, i) => (
        <Row key={i}>
          <Input
            type="text"
            name={`work[${index}].highlights[${i}]`}
            placeholder="Did cool stuff at company"
            component="textarea"
            rows="4"
          />
          <ButtonRow>
            <RoundButton
              inverted
              type="button"
              onClick={() => addHighlight(index, i)}
            >
              <Icon type="add" />
            </RoundButton>
            <RoundButton
              inverted
              disabled={highlights.length === 1}
              type="button"
              onClick={() => removeHighlight(index, i)}
            >
              <Icon type="remove" />
            </RoundButton>
          </ButtonRow>
        </Row>
      ))}
    </div>
  )
}

export default Job
