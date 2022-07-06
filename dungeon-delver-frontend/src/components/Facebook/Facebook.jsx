import * as React from 'react'
import FacebookLogin from 'react-facebook-login' //External library
import axios from 'axios'

const backendUrl="http://localhost:3001/"

export default function Facebook() {
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [userId, setUserId] = React.useState("");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [picture, setPicture] = React.useState();

  const componentClicked = () => {
  }

  const postData = async (response) => {
    try {
      const userData = await axios.post(`${backendUrl}user`, {userData: response})
      // Update state variable holding current user
      setLoggedIn(true);
      setUserId(response.userID);
      setName(response.name);
      setEmail(response.email);
      setPicture(response.picture.data.url);
    }
    catch (err) {
      console.log(err);
    }
  }
  
  const responseFacebook = response => {
    console.log(response);
    postData(response);
  }

  let fbContent = null;

  if(loggedIn) {
    //do things when logged in
    fbContent=(
      <div>
        <img src={picture} alt={name} />
        <h2>Welcome {name}!</h2>
        Email: {email}
      </div>
    )
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
