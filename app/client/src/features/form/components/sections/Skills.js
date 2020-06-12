/**
 * @flow
 */

import React from 'react'
import { connect } from 'react-redux'
import Section from './Section'
import { Button, Divider } from '../../../../common/components'
import LabeledInput from '../fragments/LabeledInput'
import { Skill } from '..'
import {
  addSkill,
  removeSkill,
  swapSkills,
  addSkillKeyword,
  removeSkillKeyword
} from '../../actions'
import type { FormValues } from '../../types'
import type { State } from '../../../../app/types'

type Props = {
  skills: $PropertyType<FormValues, 'skills'>,
  addSkill: () => void,
  removeSkill: () => void,
  swapSkills: (index: number) => void,
  addSkillKeyword: (index: number, i: number) => void,
  removeSkillKeyword: (index: number, i: number) => void
}

function Skills({
  skills,
  addSkill,
  removeSkill,
  swapSkills,
  addSkillKeyword,
  removeSkillKeyword
}: Props) {
  return (
    <Section heading="Your Skills">
      <LabeledInput
        name="headings.skills"
        label="Section Heading"
        placeholder="Skills"
      />
      <Divider />
      {skills.map((skill, i) => (
        <Skill
          key={i}
          index={i}
          keywords={skill.keywords}
          swapSkills={swapSkills}
          addKeyword={addSkillKeyword}
          removeKeyword={removeSkillKeyword}
        />
      ))}
      <Button onClick={addSkill} type="button">
        Add Skill
      </Button>
      <Button
        onClick={removeSkill}
        disabled={skills.length === 1}
        type="button"
      >
        Remove Skill
      </Button>
    </Section>
  )
}

function mapState(state: State) {
  return {
    skills: state.form.resume.values.skills
  }
}

const mapActions = {
  addSkill,
  removeSkill,
  swapSkills,
  addSkillKeyword,
  removeSkillKeyword
}

export default connect(mapState, mapActions)(Skills)
