/**
 * @flow
 */

import React from 'react'
import styled from 'styled-components'
import { darken, rgba } from 'polished'
import {
  Logo,
  Divider,
  RoundButton,
  Icon,
  Loader
} from '../../common/components'
import {
  Label,
  Input
} from '../../features/form/components/fragments/LabeledInput'
import { LoadingBar } from '../../features/preview/components'
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

const Heading = styled.h2`
  color: white;
  font-size: 2.25em;
  margin: 10px 0;
`

const Question = styled.p`
  font-size: 1.5em;
`

const Answer = styled.p`
  padding-left: 1em;
`

const ListAnswer = styled.ol`
  padding-left: 2em;
  li {
    padding: 2px 0;
  }
`

const Box = styled.div`
  width: calc(100% - 4px);
  background: black;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 50px 0;
  border: 2px solid ${colors.borders};
`

const Color = styled.div`
  width: 100px;
  height: 100px;
  background: ${props => props.color};
  color: ${props => (props.dark ? 'black' : colors.foreground)};
  margin: 15px;
  display: flex;
  justify-content: center;
  align-items: center;

  @media screen and (max-width: 50px) {
    width: 75px;
    height: 75px;
    margin: 2px;
  }
`

const Button = styled.button`
  width: 100px;
  height: 35px;
  padding: 5px 10px;
  border: 1px solid;
  border-color: ${colors.primary};
  border-radius: 2px;
  background: transparent;
  color: ${colors.primary};
  margin: 15px;
  outline: none;
  transition: all 0.4s ease;
  user-select: none;

  &:hover {
    background: ${colors.primary};
    color: ${colors.background};
    cursor: pointer;
  }

  i {
    color: ${colors.primary};
  }

  &:disabled {
    border-color: #444;
    color: #444;

    &:hover {
      background: ${colors.background};
      border-color: #444;
      color: #444;
      cursor: not-allowed;
    }

    i {
      color: #444;
    }

    &:active {
      position: initial;
    }
  }
`

const PrimaryButton = Button.extend`
  background: linear-gradient(
    40deg,
    ${darken(0.3, colors.primary)},
    ${colors.primary}
  );
  color: white;
  border-radius: 100px;
  border: 1px solid ${darken(0.1, colors.primary)};
  box-shadow: 0 0 0 0 ${rgba(colors.primary, 0.7)};

  &:hover {
    background: linear-gradient(
      40deg,
      ${darken(0.4, colors.primary)},
      ${colors.primary}
    );
    color: white;
    cursor: pointer;
  }
`

const UnfilledButton = PrimaryButton.extend`
  background: transparent;
  &:hover {
    background: linear-gradient(
      40deg,
      ${darken(0.5, colors.primary)},
      ${darken(0.3, colors.primary)}
    );
    animation: none;
    cursor: pointer;
  }
`

const RoundedButton = RoundButton.extend`
  margin: 15px;
`

const VerticalBox = Box.extend`
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const FormLabel = Label.extend`
  margin-top: 0;
`

const FormInput = Input.withComponent('input').extend`
  width: 50%;
  margin-bottom: 25px;

  @media screen and (max-width: 50px) {
    width: 50%;
  }
`

const FormDivider = Divider.extend`
  width: 50%;
  margin: 0;
  padding: 0;

  @media screen and (max-width: 50px) {
    width: 50%;
  }
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
          Usage instructions are available on your <Link href="https://www.thedataincubator.com/fellows/manage.html#resume1">profile page</Link>.
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
