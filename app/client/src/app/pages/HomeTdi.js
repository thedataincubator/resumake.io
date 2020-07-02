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
import { Bars } from '../../common/components'
import { uploadFileAndGenerateResume } from '../../features/form/actions'
import { clearState } from '../actions'
import { initializeApplication } from '../../features/tdi/actions'
import { colors } from '../../common/theme'
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

const LoadWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

type Props = {
  adminPath: ?boolean,
  resumeStatus: string,
  jsonUpload: {
    status?: 'pending' | 'success' | 'failure',
    errMessage?: string
  },
  clearState: () => void,
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
      resumeStatus,
      jsonUpload,
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
    resumeStatus: state.preview.resume.status,
    jsonUpload: state.form.resume.jsonUpload
  }
}

const mapActions = {
  clearState,
  uploadFileAndGenerateResume,
  initializeApplication
}

export default withRouter(connect(mapState, mapActions)(Home))
