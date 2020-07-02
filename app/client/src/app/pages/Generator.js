/**
 * @flow
 */

import React from 'react'
import Loadable from 'react-loadable'
import { ToastContainer } from 'react-toastify'
import styled from 'styled-components'
import Form from '../../features/form/components'
import { SideNav } from '../../features/progress/components'
import { Loader, Bars } from '../../common/components'
import { sizes } from '../../common/theme'
import type { Location } from 'react-router-dom'

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`

const Content = styled.main`
  display: flex;
  margin-top: ${sizes.header};
  margin-left: ${sizes.sideNav};
  width: calc(100% - ${sizes.sideNav});
  height: calc(100% - ${sizes.header} - 1px);

  @media screen and (max-width: 50px) {
    width: 100%;
    margin-left: 0;
    flex-direction: column;
  }
`

const Working = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: #444444aa;
  display: none;
  justify-content: center;
  align-items: center;

  body.working & {
    display: flex;
  }
`

const LoadablePreview = Loadable({
  loader: () => import('../../features/preview/components'),
  loading: Loader
})

type Props = {
  location: Location
}

function Generator({ location }: Props) {
  return (
    <Layout>
      <ToastContainer />
      <SideNav />
      <Content>
        <Form location={location} />
        <LoadablePreview hideOnMobile />
      </Content>
      <Working><Bars /></Working>
    </Layout>
  )
}

export default Generator
