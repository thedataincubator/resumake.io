/**
 * @flow
 */

import React from 'react'
import styled from 'styled-components'
import { Row, Swap, Button } from '../../../../common/components'
import LabeledInput, { Label, Input } from './LabeledInput'

const ButtonRow = styled.div`
  margin-left: 15px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
`

const MiniInput = Input.extend`
  width: 50%;

  @media screen and (max-width: 850px) {
    width: 60%;
  }
`

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
        <Button
          onClick={() => removeProject(index)}
          disabled={!canRemove}
          type="button"
        >
          Remove Project
        </Button>
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
