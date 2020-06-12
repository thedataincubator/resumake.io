/**
 * @flow
 */

import React, { Component } from 'react'
import { reduxForm } from 'redux-form'
import { connect } from 'react-redux'
import { Switch, Route, Redirect, type Location } from 'react-router-dom'
import styled from 'styled-components'
import {
  Templates,
  Profile,
  Education,
  Work,
  Skills,
  Projects,
  Awards
} from '.'
import Preview from '../../preview/components'
import { ScrollToTop } from '../../../common/components'
import { generateResume } from '../../preview/actions'
import { setProgress } from '../../progress/actions'
import { colors } from '../../../common/theme'
import type { FormValues } from '../types'
import type { State } from '../../../app/types'
import type { Section } from '../../../common/types'

const StyledForm = styled.form`
  width: 40%;
  margin: 0;
  padding: 25px 0 0 0;
  border-right: 1px solid ${colors.borders};
  overflow-y: auto;

  @media screen and (max-width: 850px) {
    width: 100%;
    border: none;
  }
`

type Props = {
  sections: Array<Section>,
  location: Location,
  handleSubmit: *,
  setProgress: (sections: Array<Section>, curr: Section) => void,
  generateResume: (payload: FormValues) => Promise<void>
}

class Form extends Component<Props> {
  form: ?HTMLFormElement

  componentWillMount() {
    if (this.props.progress === 0) {
      this.updateProgress()
    }
  }

  shouldComponentUpdate(prevProps) {
    return prevProps.location.pathname !== this.props.location.pathname
  }

  componentDidUpdate() {
    this.updateProgress()

    if (this.form) {
      this.form.scrollTop = 0
    }
  }

  onSubmit = (values: FormValues) => {
    const { sections, generateResume } = this.props
    generateResume({ ...values, sections })
  }

  updateProgress() {
    const { sections, location, setProgress } = this.props

    if (
      !location.pathname.startsWith('/resumake/generator/') ||
      location.pathname.includes('mobile')
    ) {
      return
    }

    const currSection: Section = (location.pathname.slice(11): any)
    setProgress(sections, currSection)
  }

  render() {
    const { handleSubmit } = this.props
    return (
      <StyledForm
        id="resume-form"
        onSubmit={handleSubmit(this.onSubmit)}
        innerRef={form => (this.form = form)}
      >
        <ScrollToTop>
          <Switch>
            <Route
              exact
              path="/resumake/generator"
              render={() => <Redirect to="/resumake/generator/templates" />}
            />
            <Route exact path="/resumake/generator/templates" component={Templates} />
            <Route exact path="/resumake/generator/profile" component={Profile} />
            <Route exact path="/resumake/generator/education" component={Education} />
            <Route exact path="/resumake/generator/work" component={Work} />
            <Route exact path="/resumake/generator/skills" component={Skills} />
            <Route exact path="/resumake/generator/projects" component={Projects} />
            <Route exact path="/resumake/generator/awards" component={Awards} />
            <Route exact path="/resumake/generator/mobile-preview" component={Preview} />
            <Route path="*" render={() => <h1 style={{ margin: 0 }}>404</h1>} />
          </Switch>
        </ScrollToTop>
      </StyledForm>
    )
  }
}

function mapState(state: State) {
  return {
    sections: state.progress.sections,
    progress: state.progress.progress,
    initialValues: state.tdi.fellowData
  }
}

const mapActions = {
  generateResume,
  setProgress
}

const ReduxForm = reduxForm({
  form: 'resume',
  destroyOnUnmount: false
})(Form)

const ConnectedForm = connect(mapState, mapActions)(ReduxForm)

export default (ConnectedForm)
