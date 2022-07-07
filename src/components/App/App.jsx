import * as React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from 'axios'

import './App.css';
import Facebook from '../Facebook/Facebook';
import Home from "../Home/Home"
import Navbar from "../Navbar/Navbar"
import NotFound from "../NotFound/NotFound"
import Loader from "../Loader/Loader"

const backendUrl="http://localhost:3001/"



function App() {
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [picture, setPicture] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);

  const responseFacebook = async (response) => {
    try {
      await axios.post(`${backendUrl}user`, {userData: response})
      // Update state variable holding current user
      setLoggedIn(true);
      setName(response.name);
      setEmail(response.email);
      setPicture(response.picture.data.url);
      setIsLoading(false);
    }
    catch (err) {
      console.log(err);
    }
  }

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
        <Facebook  setIsLoading={setIsLoading} responseFacebook={responseFacebook}/>
      </div>
    );
  }
  else {
    return <div className="App">
      <BrowserRouter>
          <Navbar handleLogout={handleLogout}/>
          <Routes>
            <Route path ="/" element = {<Home />} />
            <Route path = "*" element={<NotFound />} />
          </Routes>
      </BrowserRouter>
    </div>;
  }
}

export default App;
