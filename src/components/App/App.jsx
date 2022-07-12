import * as React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Constants from '../../constants/appConstants';

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
import PartyPage from "../PartyPage/PartyPage"

import Keys from "../../keys.json"

import { useRecoilState, useRecoilValue } from 'recoil';
import { isLoggingInState, loggedInState } from '../../recoil/atoms/atoms';

Parse.initialize(Keys.parse.appId, Keys.parse.javascriptKey)
Parse.serverURL = 'https://parseapi.back4app.com';

function App() {

  const [loggedIn, setLoggedIn] = useRecoilState(loggedInState)
  const isLoading = useRecoilValue(isLoggingInState)

  const getCurrentUser = Constants().getCurrentUser
  const URL = Constants().URL;

  const handleLogout = async () => {
    try {
      await Parse.User.logOut();
      // To verify that current user is now empty, currentAsync can be used
      const currentUser = await Parse.User.current();
      if (!currentUser === null) {
        console.error("Logout Failed")
        return false;
      }
      await getCurrentUser();
      // Update state variable holding current user
      window.location.reload();
      return true;
    } catch (error) {
      setLoggedIn(false);
      window.location.reload();
    }
    
  }

  const enableAccount = async () => {
    try {
      const currentUser = await Parse.User.current();
      const query = new Parse.Query("User");
      const user = await query.get(currentUser.id);
      user.set("enabled", true)
      await user.save();
      const currUser = await getCurrentUser();
      if(!currUser.get("enabled")) {
        throw new Error("Failed to re-enable user")
      }
    }
    catch (error) {
      console.log(error)
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

  if(loggedIn==="disabled") {
      return (
        <div className="disabled-user">
          <BrowserRouter><Navbar handleLogout={handleLogout}/></BrowserRouter>
          <h1>Your account is disabled. Would you like to re-enable it?</h1>
          <button className="enable-account" onClick={enableAccount}>Enable Account</button>
          <h1>Alternatively, log in with a different facebook account</h1>
          <Facebook />
        </div>
      )
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
            <Route path="/party/:partyId" element={<PartyPage />}/>
            <Route path = "*" element={<NotFound />} />
          </Routes>
      </BrowserRouter>
    </div>;
  }
}

export default App;
