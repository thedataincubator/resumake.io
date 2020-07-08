/**
 * @flow
 */

import type { Section } from '../../common/types'

type Headings = {
  work: string,
  education: string,
  skills: string,
  projects: string,
  awards: string
}

type Basics = {
  name?: ?string,
  email?: ?string,
  phone?: ?string,
  website?: ?string,
  location?: {
    address?: ?string
  },
  visa?: ?string
}

type School = {
  institution?: ?string,
  location?: ?string,
  area?: ?string,
  studyType?: ?string,
  startDate?: ?string,
  endDate?: ?string,
  gpa?: ?string
}

type Job = {
  company?: ?string,
  location?: ?string,
  position?: ?string,
  website?: ?string,
  startDate?: ?string,
  endDate?: ?string,
  highlights: Array<?string>
}

type Skill = {
  name?: ?string,
  keywords: Array<?string>
}

type Project = {
  name?: ?string,
  description?: ?string,
  url?: ?string,
  keywords: Array<?string>
}

type Award = {
  title?: ?string,
  date?: ?string,
  awarder?: ?string,
  summary?: ?string
}

type FormValues = {
  selectedTemplate: number,
  headings: Headings,
  basics: Basics,
  work: Array<Job>,
  education: Array<School>,
  skills: Array<Skill>,
  projects: Array<Project>,
  awards: Array<Award>
}

type FormValuesWithSectionOrder = FormValues & {
  sections: Array<Section>
}

type JsonUpload = {
  status?: 'pending' | 'success' | 'failure',
  errMessage?: string
}

type FormState = {
  jsonUpload: JsonUpload,
  values: FormValues,
  anyTouched?: boolean,
  registeredFields?: Object,
  fields?: Object
}

type TdiAction = // Doesn't justify separate tdi/types.js file yet
  | { type: 'UPDATE_FELLOW_DATA', fellowData: FormValuesWithSectionOrder }
  | { type: 'STORE_FELLOW_KEY', fellowKeyUrlsafe: string }

type FormAction =
  | { type: 'UPLOAD_JSON_REQUEST' }
  | { type: 'UPLOAD_JSON_SUCCESS', json: FormValues }
  | { type: 'UPLOAD_JSON_FAILURE', errMessage: string }
  | { type: 'SELECT_TEMPLATE', templateId: number }
  | { type: 'ADD_SCHOOL' }
  | { type: 'REMOVE_SCHOOL', index: number }
  | { type: 'SWAP_SCHOOLS', index: number }
  | { type: 'ADD_JOB' }
  | { type: 'REMOVE_JOB', index: number }
  | { type: 'ADD_JOB_HIGHLIGHT', index: number, i: number }
  | { type: 'REMOVE_JOB_HIGHLIGHT', index: number, i: number }
  | { type: 'REORDER_JOB_HIGHLIGHTS', index: number, oldIndex: number, newIndex: number }
  | { type: 'SWAP_JOBS', index: number }
  | { type: 'ADD_SKILL' }
  | { type: 'REMOVE_SKILL', index: number }
  | { type: 'SWAP_SKILLS', index: number }
  | { type: 'ADD_SKILL_KEYWORD', index: number, i: number }
  | { type: 'REMOVE_SKILL_KEYWORD', index: number, i: number }
  | { type: 'REORDER_SKILL_KEYWORDS', index: number, oldIndex: number, newIndex: number }
  | { type: 'ADD_PROJECT' }
  | { type: 'REMOVE_PROJECT', index: number }
  | { type: 'ADD_PROJECT_KEYWORD', index: number }
  | { type: 'REMOVE_PROJECT_KEYWORD', index: number }
  | { type: 'SWAP_PROJECTS', index: number }
  | { type: 'ADD_AWARD' }
  | { type: 'REMOVE_AWARD' }

export type { JsonUpload, FormState, FormAction, FormValues, FormValuesWithSectionOrder, TdiAction }
