/**
 * @flow
 */

import React from 'react'
import styled from 'styled-components'
import {
  Logo,
  Divider,
} from '../../common/components'
import { colors } from '../../common/theme'

const Wrapper = styled.div`
  max-width: 850px;
  width: 90%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Header = styled.header`
  width: 100%;
  margin-top: 50px;
`

const Link = styled.a`
  color: ${colors.primary};
`

const SectionDivider = Divider.extend`
  width: 100%;
  margin: 4em 0;
  padding: 0;
`

const Content = styled.main`
  width: 100%;
`

function About() {
  return (
    <Wrapper>
      <Header>
        <Logo big />
        <p>
          This tool is based on the open-source <Link href="https://resumake.io">resumake.io</Link> project by <Link href="http://saadq.com">Saad Quadri</Link>.
        </p>
        <p>
          The <Link href="https://github.com/saadq/resumake.io">original project</Link> is available under the <Link href="https://github.com/saadq/resumake.io/blob/master/license">MIT license</Link>.
        </p>
        <p>
          Usage instructions are available on your <Link href="/fellows/dashboard">dashboard page</Link>.
        </p>
      </Header>
      <SectionDivider />
      <Content>
        <section>
          <p>
            Copyright &copy; 2017&ndash;2019 Saad Quadri.
          </p>
          <p>
            Permission is hereby granted, free of charge, to any person obtaining a copy
            of this software and associated documentation files (the "Software"), to deal
            in the Software without restriction, including without limitation the rights
            to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
            copies of the Software, and to permit persons to whom the Software is
            furnished to do so, subject to the following conditions:
          </p>
          <p>
            The above copyright notice and this permission notice shall be included in all
            copies or substantial portions of the Software.
          </p>
          <p>
            THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
            IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
            FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
            AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
            LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
            OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
            SOFTWARE.
          </p>
        </section>
        <SectionDivider />
        <section>
          <p>
            Copyright &copy; 2020 The Data Incubator.
          </p>
          <p>
            All rights reserved.
          </p>
        </section>
        <SectionDivider />
      </Content>
    </Wrapper>
  )
}

export default About
