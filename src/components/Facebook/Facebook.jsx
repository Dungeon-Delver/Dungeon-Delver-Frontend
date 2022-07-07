import * as React from 'react'
import "./Facebook.css"
import FacebookLogin from 'react-facebook-login' //External library

export default function Facebook({responseFacebook}) {
  

  const componentClicked = () => {
  }

  return (
    <div className="FacebookLogin">{<FacebookLogin
      appId="3192124317669140"
      autoLoad={false}
      fields="name,email,picture"
      onClick={componentClicked}
      callback={responseFacebook} />}</div>
  )
}
