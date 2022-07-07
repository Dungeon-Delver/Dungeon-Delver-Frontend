import * as React from 'react'
import "./Facebook.css"
import FacebookLogin from 'react-facebook-login' //External library
import Keys from "../../keys.json"

export default function Facebook({responseFacebook, setIsLoading}) {

  const componentClicked = () => {
    setIsLoading(true);
  }

  return (
    <div className="FacebookLogin">{<FacebookLogin
      appId={Keys.appId}
      autoLoad={false}
      fields="name,email,picture"
      onClick={componentClicked}
      callback={responseFacebook} />}</div>
  )
}
