import React from 'react'
import FacebookLogin from 'react-facebook-login' //External library

export default function Facebook() {
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [userId, setUserId] = React.useState("");
  const [name, setUserName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [picture, setPicture] = React.useState();

  const componentClicked = () => {
    console.log('clicked');
  }

  const responseFacebook = response => {
    console.log(response);
  }

  let fbContent = null;

  if(loggedIn) {
    //do things when logged in
  }
  else {
    fbContent = (<FacebookLogin
      appId="3192124317669140"
      autoLoad={false}
      fields="name,email,picture"
      onClick={componentClicked}
      callback={responseFacebook} />)
  }

  return (
    <div>{fbContent}</div>
  )
}
