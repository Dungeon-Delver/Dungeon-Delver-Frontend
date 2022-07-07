import * as React from 'react'
import {Link} from "react-router-dom"

import "./Navbar.css"

import Logo from "../Logo/Logo"


export default function Navbar({handleLogout}) {
  return (
    <div className="navbar">
      <Logo id="logo" />
      <Link to={`/create-party`}><button className="create-party-button">Create Party</button></Link>
      <Link to={`/find-parties`}><button className="find-parties-button">Find Parties</button></Link>
      <Link to={`/parties`}><button className="my-parties-button">My Parties</button></Link>
      <button className="logout-button" onClick={() => {handleLogout()}}>Logout</button>
    </div>
  )
}