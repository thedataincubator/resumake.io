/**
 * @flow
 */

import { generateResume } from '../preview/actions'
import type { FormAction as Action, FormValues } from './types'
import type { AsyncAction } from '../../app/types'

function uploadJSONRequest(): Action {
  return {
    type: 'OOPS_WRONG_ACTIONS'
  }
}

function uploadJSONSuccess(json: FormValues): Action {
  return {
    type: 'UPLOAD_JSON_SUCCESS',
    json
  }
}

function uploadJSONFailure(errMessage: string): Action {
  return {
    type: 'UPLOAD_JSON_FAILURE',
    errMessage
  }
}

function uploadJSON(file: File): AsyncAction {
  return async (dispatch, getState) => {
    dispatch(uploadJSONRequest())

    const { fetch, FormData } = window
    const data = new FormData()

    data.append('json-file', file)

    const request = {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: data
    }

    try {
      const response = await fetch('/resumake/api/upload', request)
      if (response.ok) {
        const json = await response.json()
        dispatch(uploadJSONSuccess(json))
      } else {
        const errMessage = await response.text()
        dispatch(uploadJSONFailure(errMessage))
      }
    } catch (err) {
      dispatch(uploadJSONFailure(err.message))
    }
  }
}

function uploadFileAndGenerateResume(file: File): AsyncAction {
  return async (dispatch, getState) => {
    await dispatch(uploadJSON(file))
    const resumeData = getState().form.resume.values
    const sections = getState().progress.sections
    await dispatch(generateResume({ ...resumeData, sections }))
  }
}

function selectTemplate(templateId: number): Action {
  return {
    type: 'SELECT_TEMPLATE',
    templateId
  }
}

function addSchool(): Action {
  return {
    type: 'ADD_SCHOOL'
  }
}

function removeSchool(index: number): Action {
  return {
    type: 'REMOVE_SCHOOL',
    index
  }
}

function swapSchools(index: number): Action {
  return {
    type: 'SWAP_SCHOOLS',
    index
  }
}

function addJob(): Action {
  return {
    type: 'ADD_JOB'
  }
}

function removeJob(index: number): Action {
  return {
    type: 'REMOVE_JOB',
    index
  }
}

function swapJobs(index: number): Action {
  return {
    type: 'SWAP_JOBS',
    index
  }
}

function addJobHighlight(index: number, i: number): Action {
  return {
    type: 'ADD_JOB_HIGHLIGHT',
    index,
    i
  }
}

function removeJobHighlight(index: number, i: number): Action {
  return {
    type: 'REMOVE_JOB_HIGHLIGHT',
    index,
    i
  }
}

function reorderJobHighlights(index: number, oldIndex: number, newIndex: number): Action {
  return {
    type: 'REORDER_JOB_HIGHLIGHTS',
    index,
    oldIndex,
    newIndex
  }
}

function addSkill(): Action {
  return {
    type: 'ADD_SKILL'
  }
}

function removeSkill(index: number): Action {
  return {
    type: 'REMOVE_SKILL',
    index
  }
}

function swapSkills(index: number): Action {
  return {
    type: 'SWAP_SKILLS',
    index
  }
}

function addSkillKeyword(index: number, i: number): Action {
  return {
    type: 'ADD_SKILL_KEYWORD',
    index,
    i
  }
}

function removeSkillKeyword(index: number, i: number): Action {
  return {
    type: 'REMOVE_SKILL_KEYWORD',
    index,
    i
  }
}

function reorderSkillKeywords(index: number, oldIndex: number, newIndex: number): Action {
  return {
    type: 'REORDER_SKILL_KEYWORDS',
    index,
    oldIndex,
    newIndex
  }
}

function addProject(): Action {
  return {
    type: 'ADD_PROJECT'
  }
}

function removeProject(index: number): Action {
  return {
    type: 'REMOVE_PROJECT',
    index
  }
}

function swapProjects(index: number): Action {
  return {
    type: 'SWAP_PROJECTS',
    index
  }
}

function addProjectKeyword(index: number): Action {
  return {
    type: 'ADD_PROJECT_KEYWORD',
    index
  }
}

function removeProjectKeyword(index: number): Action {
  return {
    type: 'REMOVE_PROJECT_KEYWORD',
    index
  }
}

function addAward(): Action {
  return {
    type: 'ADD_AWARD'
  }
}

function removeAward(): Action {
  return {
    type: 'REMOVE_AWARD'
  }
}

export {
  uploadJSON,
  uploadJSONRequest,
  uploadJSONSuccess,
  uploadJSONFailure,
  selectTemplate,
  addSchool,
  removeSchool,
  swapSchools,
  addJob,
  removeJob,
  swapJobs,
  addJobHighlight,
  removeJobHighlight,
  reorderJobHighlights,
  addSkill,
  removeSkill,
  swapSkills,
  addSkillKeyword,
  removeSkillKeyword,
  reorderSkillKeywords,
  addProject,
  removeProject,
  swapProjects,
  addProjectKeyword,
  removeProjectKeyword,
  addAward,
  removeAward,
  uploadFileAndGenerateResume
}
