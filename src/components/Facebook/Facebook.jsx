import * as React from 'react'
import "./Facebook.css"
import FacebookLogin from 'react-facebook-login' //External library
import Keys from "../../keys.json"

import Parse from 'parse/dist/parse.min.js';


import { useSetRecoilState } from 'recoil'
import { isLoggingInState, loggedInState, currentUser } from '../../recoil/atoms/atoms'

Parse.initialize(Keys.parse.appId, Keys.parse.javascriptKey)
Parse.serverURL = 'https://parseapi.back4app.com';

export default function FacebookOAuth() {

  const setLoggedIn = useSetRecoilState(loggedInState)
  const setIsLoading = useSetRecoilState(isLoggingInState)
  const setCurrentUser = useSetRecoilState(currentUser)

  const componentClicked = () => {
    setIsLoading(true);
  }

  const getCurrentUser = async () => {
      const currentUser = await Parse.User.currentAsync()
      setCurrentUser(currentUser)
      if(currentUser == null) {
        setLoggedIn(false)
      }
      else {
        setLoggedIn(true)
      }
  }

  const handleFacebookLogin = async (response) => {
    // Check if response has an error
    if(!response.hasOwnProperty("userData")) {
      console.error("No User Data");
    }
    
    response = response.userData;
    if (response.error !== undefined) {
      console.error(`Error: ${response.error}`);
    } else {
      try {
        // Gather Facebook user info
        const userId = response.id;
        const userEmail = response.email;
        const userAccessToken = response.accessToken;
        // Try to login on Parse using linkWith and these credentials
        // Create a new Parse.User object
        const userToLogin = new Parse.User();
        // Set username and email to match facebook profile email
        userToLogin.set('username', response.name);
        userToLogin.set('email', userEmail);
        userToLogin.set('picture', response.picture.data.url);        
        try {
         await userToLogin
          .linkWith('facebook', {
            authData: {id: userId, access_token: userAccessToken},
          });
          // logIn returns the corresponding ParseUser object
          await getCurrentUser();
          setLoggedIn(true)
        } catch (error) {
          // Error can be caused by wrong parameters or lack of Internet connection
          console.error(`Error! ${error.message}`);
        }
      } catch (error) {
        console.error("Error gathering Facebook user info, please try again!", error)
      }
    }
  }
  

  const responseFacebook = async (response) => {
    try {
      await handleFacebookLogin({userData: response})
      // Update state variable holding current user
      setIsLoading(false)
    }
    catch (err) {
      console.error(err);
      setIsLoading(false);
    }
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
