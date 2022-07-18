import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Constants from '../../constants/appConstants';

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
import Logo from "../../images/Logo.png"
import Parse from "../../constants/parseInitialize"

import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { isLoggingInState, loggedInState, screenWidth } from '../../recoil/atoms/atoms';
import ScrollToTop from '../../constants/scrollToTop';

function App() {

  const [loggedIn, setLoggedIn] = useRecoilState(loggedInState)
  const isLoading = useRecoilValue(isLoggingInState)

  const getCurrentUser = Constants().getCurrentUser

  useEffect( () => {
    const login = async (user) => {
    try {
      await Parse.User.become(user.sessionToken)
      await getCurrentUser()
    }
     catch (error) {
      console.error(`Error! ${error.message}`);
    }
  }
    const localStorageValue = (localStorage.getItem("user"));
    if (localStorageValue === null) {
      return;
    }
    const user = JSON.parse(localStorageValue)
    login(user)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogout = async () => {
    try {
      await Parse.User.logOut();
      // To verify that current user is now empty, currentAsync can be used
      const currentUser = await Parse.User.current();
      localStorage.removeItem("user")
      if (!currentUser === null) {
        console.error("Logout Failed")
        return false;
      }
      setLoggedIn(false);
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
      console.error(error)
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
        <div className="logo-container">
          <img src={Logo} alt="Dungeon Delver"/>
        </div>
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
          <div className="logo-container">
            <img src={Logo} alt="Dungeon Delver"/>
          </div>
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
          <ScrollToTop>
            <Routes>
              <Route path ="/" element = {<Home />} />
              <Route path="/create-party" element={<CreateParty />}/>
              <Route path="/find-parties" element={<FindParties />}/>
              <Route path="/parties" element={<MyParties />} />
              <Route path="/party/:partyId" element={<PartyPage />}/>
              <Route path = "*" element={<NotFound />} />
            </Routes>
          </ScrollToTop>
      </BrowserRouter>
    </div>;
  }
}

export default App;
