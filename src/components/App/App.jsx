import * as React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Parse from 'parse/dist/parse.min.js';

import './App.css';
import Facebook from '../Facebook/Facebook';
import Home from "../Home/Home"
import Navbar from "../Navbar/Navbar"
import NotFound from "../NotFound/NotFound"
import Loader from "../Loader/Loader"
import CreateParty from "../CreateParty/CreateParty"
import FindParties from "../FindParties/FindParties"
import MyParties from "../MyParties/MyParties"

import Keys from "../../keys.json"

import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { currentUser, isLoadingState, loggedInState } from '../../recoil/atoms/atoms';

Parse.initialize(Keys.parse.appId, Keys.parse.javascriptKey)
Parse.serverURL = 'https://parseapi.back4app.com';

function App() {

  const [loggedIn, setLoggedIn] = useRecoilState(loggedInState)
  const isLoading = useRecoilValue(isLoadingState)
  const setCurrentUser = useSetRecoilState(currentUser)


  const getCurrentUser = () => {
    const currentUser = Parse.User.current()
    setCurrentUser(currentUser)
    if(currentUser == null) {
      setLoggedIn(false)
    }
    else {
      setLoggedIn(true)
    }
}

  const handleLogout = async () => {
    try {
      await Parse.User.logOut();
      // To verify that current user is now empty, currentAsync can be used
      const currentUser = await Parse.User.current();
      if (!currentUser === null) {
        console.log("Logout Failed")
        return false;
      }
      getCurrentUser();
      // Update state variable holding current user
      window.location.reload();
      return true;
    } catch (error) {
      console.log(`Error! ${error.message}`);
      return false;
    }
    
  }

  if(isLoading) {
    return (
      <Loader />
    )
  }
  else if(!loggedIn) {
    return (
      <div className="App">
        <h1>
          Dungeon Delver
        </h1>
        <p>
          To get started, authenticate with Facebook.
        </p>
        <Facebook />
      </div>
    );
  }
  else {
    return <div className="App">
      <BrowserRouter>
          <Navbar handleLogout={handleLogout}/>
          <Routes>
            <Route path ="/" element = {<Home />} />
            <Route path="/create-party" element={<CreateParty />}/>
            <Route path="/find-parties" element={<FindParties />}/>
            <Route path="/parties" element={<MyParties />} />
            <Route path = "*" element={<NotFound />} />
          </Routes>
      </BrowserRouter>
    </div>;
  }
}

export default App;
