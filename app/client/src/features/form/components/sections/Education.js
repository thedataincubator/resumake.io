/**
 * @flow
 */

import React from 'react'
import { connect } from 'react-redux'
import Section from './Section'
import { Button, Divider } from '../../../../common/components'
import LabeledInput from '../fragments/LabeledInput'
import { School } from '..'
import { addSchool, removeSchool, swapSchools } from '../../actions'
import type { FormValues } from '../../types'
import type { State } from '../../../../app/types'

type Props = {
  education: $PropertyType<FormValues, 'education'>,
  addSchool: () => void,
  removeSchool: (index: number) => void,
  swapSchools: (index: number) => void
}

function Education({ education, addSchool, removeSchool, swapSchools }: Props) {
  return (
    <Section heading="Your Educational Background">
      <LabeledInput
        name="headings.education"
        label="Section Heading"
        placeholder="Education"
      />
      <Divider />
      {education.map((school, i) =>
        <School
          key={i}
          index={i}
          canRemove={education.length > 1}
          removeSchool={removeSchool}
          swapSchools={swapSchools}
        />)}
      <Button onClick={addSchool} type="button">
        Add School
      </Button>
    </Section>
  )
}

function mapState(state: State) {
  return {
    education: state.form.resume.values.education
  }
}

const mapActions = {
  addSchool,
  removeSchool,
  swapSchools
}

export default connect(mapState, mapActions)(Education)
