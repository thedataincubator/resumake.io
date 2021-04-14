/**
 * @flow
 */

import React from 'react'
import { Row, Swap, MarginlessButton } from '../../../../common/components'
import LabeledInput from './LabeledInput'

type Props = {
  keywords: Array<?string>,
  index: number,
  canRemove: boolean,
  removeProject: (index: number) => void,
  swapProjects: (index: number) => void,
  addKeyword: (index: number) => void,
  removeKeyword: (index: number) => void
}

function Project({ keywords, index, canRemove, removeProject, swapProjects, addKeyword, removeKeyword }: Props) {
  return (
    <div>
      {index > 0
        ? <Swap onClick={() => swapProjects(index)} />
        : null}
      <Row>
        <LabeledInput
          name={`projects[${index}].name`}
          label="Project Name"
          placeholder="Piper Chat"
        />
        <MarginlessButton
          onClick={() => removeProject(index)}
          disabled={!canRemove}
          type="button"
        >
          Remove Project
        </MarginlessButton>
      </Row>
      <LabeledInput
        name={`projects[${index}].url`}
        label="Link to Project"
        placeholder="piperchat.com"
      />
      <LabeledInput
        name={`projects[${index}].description`}
        label="Project Description"
        placeholder="A video chat app with great picture quality.&#10;.&#10;Two newlines to start new paragraph&#10;- Bulleted list&#10;- with dashes"
        component="textarea"
      />
    </div>
  )
}

export default Project
