import * as React from 'react'
import FacebookLogin from 'react-facebook-login' //External library
import axios from 'axios'

const backendUrl="http://localhost:3001/"

export default function Facebook({responseFacebook}) {
  

  const componentClicked = () => {
  }

  return (
    <div className={FacebookLogin}>{<FacebookLogin
      appId="3192124317669140"
      autoLoad={false}
      fields="name,email,picture"
      onClick={componentClicked}
      callback={responseFacebook} />}</div>
  )
}
