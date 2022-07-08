import * as React from 'react'
import "./Facebook.css"
import FacebookLogin from 'react-facebook-login' //External library
import Keys from "../../keys.json"
import axios from 'axios'
import { useSetRecoilState, useRecoilValue } from 'recoil'
import { backendUrl, email, isLoadingState, loggedInState, name, picture, userId } from '../../recoil/atoms/atoms'

export default function Facebook() {

  const URL=useRecoilValue(backendUrl)

  const loggedIn = useSetRecoilState(loggedInState)
  const setIsLoading = useSetRecoilState(isLoadingState)
  const setName = useSetRecoilState(name)
  const setEmail = useSetRecoilState(email)
  const setPicture = useSetRecoilState(picture)
  const setUserId = useSetRecoilState(userId)

  const componentClicked = () => {
    setIsLoading(true);
  }
  

  const responseFacebook = async (response) => {
    try {
      const data = await axios.post(`${URL}user`, {userData: response})
      const userId = data.data.newUser;
      // Update state variable holding current user

      loggedIn(true);
      setName(response.name);
      setEmail(response.email);
      setPicture(response.picture.data.url);
      setUserId(userId)
      setIsLoading(false);
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
