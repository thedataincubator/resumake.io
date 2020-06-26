import React from 'react'
import styled from 'styled-components'

const ToastDiv = styled.div`
  &{
    cursor: default;
  }
  & > :first-child {
    margin-top: 0;
  }
  & > :last-child {
    margin-bottom: 0;
  }
  & button {
    border: thin solid white;
    border-radius: 0.25em;
    padding: 0.25em 2em;
    background: inherit;
    color: inherit;
    cursor: pointer;
  }
  & button:hover {
    text-decoration: underline;
  }
`

const AuthToast = ({ loginURL, closeToast }) => {

  const handleClick = () =>{
    window.location.pathname = loginURL
    closeToast()
  }

  return (
    <ToastDiv>
      <p>You are not logged in to the Data Incubator website.</p>
      <button onClick={handleClick}>Go to Login Page</button>
      <p>You will be returned to this page after logging in.  You may need to repeat your action.</p>
    </ToastDiv>
  )
}

export default AuthToast
