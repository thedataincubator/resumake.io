/**
 * @flow
 */

// NOTE: this is a modified copy of Home.js. It's more convenient to
// maintain a copy than potentially merge the original file with
// upstream.

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link, withRouter, type RouterHistory } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import styled from 'styled-components'
import { lighten, darken, rgba } from 'polished'
import { Bars, Logo, RoundButton, Icon } from '../../common/components'
import { uploadFileAndGenerateResume } from '../../features/form/actions'
import { clearState } from '../actions'
import { clearPreview } from '../../features/preview/actions'
import { initializeApplication } from '../../features/tdi/actions'
import { hasPrevSession } from '../selectors'
import { colors } from '../../common/theme'
import { match } from 'react-router-dom'
import type { State } from '../types'

const Wrapper = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
`

const Main = styled.main`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;

  @media screen and (max-width: 50px) {
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
`

const Section = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
`

const LeftSection = Section.extend`
  width: 40%;
  flex-direction: column;
`

const RightSection = Section.extend`
  width: 60%;
`

const Button = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.85em;
  text-align: center;
  text-decoration: none;
  width: 175px;
  height: 45px;
  margin: 7px 0;
  background: transparent;
  color: white;
  border-radius: 100px;
  border: 1px solid ${darken(0.1, colors.primary)};
  box-shadow: 0 0 0 0 ${rgba(colors.primary, 0.7)};
  transition: all 0.4s ease;

  &:hover {
    background: linear-gradient(
      40deg,
      ${darken(0.5, colors.primary)},
      ${darken(0.3, colors.primary)}
    );
    animation: none;
    cursor: pointer;
  }

  &:active {
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.06), 0 2px 40px rgba(0, 0, 0, 0.16);
    border-color: ${lighten(0.15, colors.primary)};
    color: ${lighten(0.15, colors.primary)};
  }

  &:focus {
    outline: none;
  }
`

const PrimaryButton = Button.extend`
  margin-top: 15px;
  background: linear-gradient(
    40deg,
    ${darken(0.3, colors.primary)},
    ${colors.primary}
  );

  &:hover {
    background: linear-gradient(
      40deg,
      ${darken(0.4, colors.primary)},
      ${colors.primary}
    );
  }
`

const Label = Button.withComponent('label')

const Input = styled.input`
  display: none;
`

const ResumePreview = styled.div`
  position: relative;
  width: 100%;
  height: 100%;

  @media screen and (max-width: 50px) {
    display: none;
  }
`

const Image = styled.img`
  width: 50%;
  height: auto;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  z-index: 2;
  box-shadow: 0 2px 25px 2px rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  background: white;

  &:first-child {
    top: 10em;
    left: -15em;
    z-index: 3;
  }

  &:last-child {
    z-index: 1;
    top: -10em;
    left: 15em;
  }
`

const Footer = styled.footer`
  width: 100%;
  height: 75px;
  background: ${darken(0.02, colors.background)};
  border-top: 1px solid ${colors.borders};
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8em;
  color: ${lighten(0.3, colors.background)};

  @media screen and (max-width: 50px) {
    font-size: 0.75em;
  }
`

const Links = styled.div`
  margin-right: 50px;

  @media screen and (max-width: 50px) {
    margin-right: 15px;
  }

  a {
    text-decoration: none;
    color: ${lighten(0.3, colors.background)};
    margin: 0 1em;

    &:hover {
      text-decoration: underline;
    }
  }
`

const Copyright = styled.span`
  opacity: 0.75;
  margin-left: 50px;

  @media screen and (max-width: 50px) {
    margin-left: 15px;
  }
`

const LoadWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const ImportRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`

const HelpButton = RoundButton.extend`
  position: absolute;
  right: -50px;
  border: none;

  &:hover {
    background: transparent;
    i {
      color: ${colors.primary};
    }
  }

  @media screen and (max-width: 50px) {
    display: none;
  }
`

const ctx = require.context('../../features/form/assets/img', true)
const images = ctx.keys().map(ctx)

type Props = {
  adminPath: ?Boolean,
  hasPrevSession: boolean,
  resumeStatus: string,
  jsonUpload: {
    status?: 'pending' | 'success' | 'failure',
    errMessage?: string
  },
  clearState: () => void,
  clearPreview: () => void,
  uploadFileAndGenerateResume: (file: File) => Promise<void>,
  initializeApplication: (history: RouterHistory, fellowKeyUrlsafe: ?string) => Promise<void>,
  history: RouterHistory
}

class Home extends Component<Props> {

  toastId: *

  onFileUpload = async (e: SyntheticInputEvent<*>) => {
    const { uploadFileAndGenerateResume } = this.props
    const file = e.target.files[0]

    await uploadFileAndGenerateResume(file)
    const { jsonUpload, history } = this.props

    if (jsonUpload.status === 'success') {
      history.push('/resumake/generator')
    } else if (jsonUpload.status === 'failure') {
      toast.error(jsonUpload.errMessage, { position: toast.POSITION.TOP_LEFT })
    }
  }

  clearState = () => {
    this.props.clearState()
    window.localStorage.clear()
  }

  componentDidMount = () => {
    const {
      adminPath, // Unused, but we could build admin-aware initialization off of this flag
      match: {
        params: {
          fellowKeyUrlsafe
        }
      },
      history,
      initializeApplication
    } = this.props
    initializeApplication(fellowKeyUrlsafe, history)
  }

  render() {
    const {
      hasPrevSession,
      resumeStatus,
      jsonUpload,
      clearPreview
    } = this.props

    // Show loading screen if file is still uploading or if resume is generating
    if (jsonUpload.status === 'pending' || resumeStatus === 'pending') {
      return (
        <LoadWrapper>
          <Bars />
        </LoadWrapper>
      )
    }

    return (
      <Wrapper>
        <ToastContainer />
        <Main>
          <span>
            If you are not redirected in a few seconds, please <Link to="/resumake/generator" style={{ color: colors.primary }}>click here</Link>.
          </span>
        </Main>
      </Wrapper>
    )
  }
}

function mapState(state: State) {
  return {
    hasPrevSession: hasPrevSession(state),
    resumeStatus: state.preview.resume.status,
    jsonUpload: state.form.resume.jsonUpload
  }
}

const mapActions = {
  clearState,
  clearPreview,
  uploadFileAndGenerateResume,
  initializeApplication
}

export default withRouter(connect(mapState, mapActions)(Home))
