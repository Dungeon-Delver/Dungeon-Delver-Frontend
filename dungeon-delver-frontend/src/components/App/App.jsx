import * as React from 'react'
import './App.css';
import Facebook from '../Facebook/Facebook';

import axios from 'axios'
const backendUrl="http://localhost:3001/"



function App() {
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [userId, setUserId] = React.useState("");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [picture, setPicture] = React.useState();

  const responseFacebook = async (response) => {
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

  if(!loggedIn) {
    return (
      <div className="App">
        <h1>
          Dungeon Delver
        </h1>
        <p>
          To get started, authenticate with Facebook.
        </p>
        <Facebook responseFacebook={responseFacebook}/>
      </div>
    );
  }
  else {
    return <div>{name}</div>;
  }
}

export default App;
