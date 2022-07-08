import * as React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";

import './App.css';
import Facebook from '../Facebook/Facebook';
import Home from "../Home/Home"
import Navbar from "../Navbar/Navbar"
import NotFound from "../NotFound/NotFound"
import Loader from "../Loader/Loader"
import CreateParty from "../CreateParty/CreateParty"
import FindParties from "../FindParties/FindParties"
import MyParties from "../MyParties/MyParties"

import { useRecoilState, useRecoilValue } from 'recoil';
import { isLoadingState, loggedInState } from '../../recoil/atoms/atoms';




function App() {

  const [loggedIn, setLoggedIn] = useRecoilState(loggedInState)
  const isLoading = useRecoilValue(isLoadingState)

  const handleLogout = () => {
    setLoggedIn(false);
    window.location.reload(false);
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
