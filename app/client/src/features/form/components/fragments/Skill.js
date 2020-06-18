/**
 * @flow
 */

import React from 'react'
import styled from 'styled-components'
import { Button, RoundButton, Icon, Row, Swap } from '../../../../common/components'
import LabeledInput, { Label, Input } from './LabeledInput'
import { SortableElement, SortableContainer} from 'react-sortable-hoc'
import { DragHandle } from '../../../progress/components/SortableList'

const ButtonRow = styled.div`
  margin-left: 15px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
`

const MiniInput = Input.extend`
  width: 50%;

  @media screen and (max-width: 850px) {
    width: 65%;
  }
`

const SortableSkill = SortableElement(({ keywordIndex, skillIndex, addKeyword, removeKeyword, canRemove }) => {
  return (
    <div>
      <DragHandle />
      <MiniInput
        name={`skills[${skillIndex}].keywords[${keywordIndex}]`}
        placeholder="Java"
        component="input"
      />
      <ButtonRow>
        <RoundButton
          inverted
          type="button"
          onClick={() => addKeyword(skillIndex, keywordIndex)}
        >
          <Icon type="add" />
        </RoundButton>
        <RoundButton
              inverted
              type="button"
              disabled={!canRemove}
              onClick={() => removeKeyword(skillIndex, keywordIndex)}
            >
              <Icon type="remove" />
            </RoundButton>
      </ButtonRow>
    </div>
  )
})

const SortableSkills = SortableContainer(({items, skillIndex, addKeyword, removeKeyword, canRemove}) => {
  return (
    <div>
      {items.map((value, index) => (
        <SortableSkill
          key={`item-${index}`}
          index={index}
          keywordIndex={index}
          value={value}
          skillIndex={skillIndex}
          addKeyword={addKeyword}
          removeKeyword={removeKeyword}
          canRemove={canRemove}
        />
      ))}
    </div>
  )
})

type Props = {
  keywords: Array<?string>,
  index: number,
  canRemove: boolean,
  removeSkill: (index: number) => void,
  swapSkills: (index: number) => void,
  addKeyword: (index: number, i: number) => void,
  removeKeyword: (index: number, i: number) => void,
  reorderSkillKeywords: (index: number, oldIndex: number, newIndex: number) => void
}

function Skill({ keywords, index, canRemove, removeSkill, swapSkills, addKeyword, removeKeyword, reorderSkillKeywords }: Props) {
  return (
    <div>
      {index > 0
        ? <Swap
            onClick={() => swapSkills(index)}
          />
        : null}
      <Row>
        <LabeledInput
          name={`skills[${index}].name`}
          label="Skill Name"
          placeholder="Programming Languages"
        />
        <Button
          onClick={() => removeSkill(index)}
          disabled={!canRemove}
          type="button"
        >
          Remove Skill
        </Button>
      </Row>
      <Label>Skill Details</Label>
      <SortableSkills
        useDragHandle
        lockToContainerEdges
        lockAxis="y"
        items={keywords}
        addKeyword={addKeyword}
        removeKeyword={removeKeyword}
        skillIndex={index}
        canRemove={keywords.length > 1}
        onSortStart={() => document.body.classList.toggle('grabbing')}
        onSortEnd={({ oldIndex, newIndex }) => {
                    reorderSkillKeywords(index, oldIndex, newIndex)
                    document.body.classList.toggle('grabbing')
                  }}
      />
    </div>
  )
}

export default Skill
