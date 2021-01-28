/**
 * @flow
 */

import React from 'react'
import styled from 'styled-components'
import { SortableElement, SortableContainer } from 'react-sortable-hoc'
import { RoundButton, Icon, Row, Swap, MarginlessButton } from '../../../../common/components'
import LabeledInput, { Label, Input } from './LabeledInput'
import { DragHandle } from '../../../progress/components/SortableList'


const ButtonRow = styled.div`
  display: inline-flex;
  justify-content: flex-end;
  align-items: center;
  margin-left: 15px;
  ${props => props.hidden && 'opacity: 0;'} transition: none;
`

const SortableHighLight = SortableElement(({ highlightIndex, jobIndex, addHighlight, removeHighlight, canRemove }) => {
  return (
    <Row>
      <DragHandle />
      <Input
        type="text"
        name={`work[${jobIndex}].highlights[${highlightIndex}]`}
        placeholder="Did cool stuff at company"
        component="textarea"
        rows="4"
      />
      <ButtonRow>
        <RoundButton
          inverted
          type="button"
          onClick={() => addHighlight(jobIndex, highlightIndex)}
        >
          <Icon type="add" />
        </RoundButton>
        <RoundButton
          inverted
          disabled={!canRemove}
          type="button"
          onClick={() => removeHighlight(jobIndex, highlightIndex)}
        >
          <Icon type="remove" />
        </RoundButton>
      </ButtonRow>
    </Row>
  )
})

const SortableHighLights = SortableContainer(({ items, jobIndex, addHighlight, removeHighlight, canRemove}) => {
  return (
    <div>
      {items.map((value, index) => (
        <SortableHighLight
          key={`item-${index}`}
          index={index}
          highlightIndex={index}
          value={value}
          jobIndex={jobIndex}
          addHighlight={addHighlight}
          removeHighlight={removeHighlight}
          canRemove={canRemove}
        />
      ))}
    </div>
  )
})

type Props = {
  highlights: Array<?string>,
  index: number,
  canRemove: boolean,
  removeJob: (index: number) => void,
  swapJobs: (index: number) => void,
  addHighlight: (index: number) => void,
  removeHighlight: (index: number) => void,
  reorderJobHighlights: (index: number, oldIndex: number, newIndex: number) => void
}

function Job({ highlights, index, canRemove, removeJob, swapJobs,  addHighlight, removeHighlight, reorderJobHighlights }: Props) {
  return (
    <div>
      {index > 0
        ? <Swap onClick={() => swapJobs(index) } />
        : null}
      <Row>
        <LabeledInput
          name={`work[${index}].company`}
          label="Company Name"
          placeholder="Google"
        />
        <MarginlessButton
          onClick={() => removeJob(index)}
          disabled={!canRemove}
          type="button"
        >
          Remove Job
        </MarginlessButton>
      </Row>
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
      <SortableHighLights
        useDragHandle
        lockToContainerEdges
        lockAxis="y"
        items={highlights}
        addHighlight={addHighlight}
        removeHighlight={removeHighlight}
        jobIndex={index}
        canRemove={highlights.length > 1}
        onSortStart={() => document.body.classList.toggle('grabbing')}
        onSortEnd={({ oldIndex, newIndex }) => {
                    reorderJobHighlights(index, oldIndex, newIndex)
                    document.body.classList.toggle('grabbing')
                  }}
      />
    </div>
  )
}

export default Job
