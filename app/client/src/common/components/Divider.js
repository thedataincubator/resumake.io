/**
 * @flow
 */

import React from 'react'
import styled from 'styled-components'
import { colors } from '../../common/theme'

const Divider = styled.hr`
  height: 10px;
  margin-left: 0;
  margin-right: 0;
  margin-top: 35px;
  border: none;
  background: ${colors.primary};
  opacity: 0.75;

  @media screen and (max-width: 50px) {
    width: 100%;
  }
`

const SwapEl = styled.div`
  margin-left: 0;
  margin-right: 0;
  margin-top: 35px;
  border: 2px solid ${colors.primary};
  border-radius: 2px;
  padding: 5px;
  background: ${colors.background};
  color: ${colors.primary};
  cursor: ns-resize;
  text-align: center;
  opacity: 0.75;
  transition: all 0.4s ease;
  user-select: none;

  @media screen and (max-width: 50px) {
    width: 100%;
  }

  &:hover {
    background: ${colors.primary};
    color: ${colors.background};
  }
`

function Swap({onClick}) {
  return (
    <SwapEl
      onClick={onClick}
    >
      ⬇ Swap ⬆
    </SwapEl>
  )
}

export {Divider, Swap}
export default Divider
