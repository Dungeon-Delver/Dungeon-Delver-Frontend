import * as React from 'react'
import "./Facebook.css"
import FacebookLogin from 'react-facebook-login' //External library
import Keys from "../../keys.json"
import axios from 'axios'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { email, isLoadingState, loggedInState, name, picture } from '../../recoil/atoms/atoms'

const backendUrl="http://localhost:3001/"

export default function Facebook() {

  const loggedIn = useSetRecoilState(loggedInState)
  const [isLoading, setIsLoading] = useRecoilState(isLoadingState)
  const setName = useSetRecoilState(name)
  const setEmail = useSetRecoilState(email)
  const setPicture = useSetRecoilState(picture)

  const componentClicked = () => {
    setIsLoading(true);
  }
  

  const responseFacebook = async (response) => {
    try {
      await axios.post(`${backendUrl}user`, {userData: response})
      // Update state variable holding current user

      loggedIn(true);
      setName(response.name);
      setEmail(response.email);
      setPicture(response.picture.data.url);
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
