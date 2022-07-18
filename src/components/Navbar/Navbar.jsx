import * as React from 'react'
import {Link} from "react-router-dom"

import "./Navbar.css"
import Logo from "../Logo/Logo"
import classNames from 'classnames';


export default function Navbar({handleLogout}) {

  const [openNavbar, setOpenNavbar] = React.useState(false);
  const toggleNavbar = () => {
    setOpenNavbar(!openNavbar)
  }

  return (
    <div className={classNames({"navbar": true, "responsive": openNavbar})}>
      <Logo id="logo" />
      <div className="nav-button-container"><Link to={`/create-party`}><button className="create-party-button nav-button">Create Party</button></Link></div>
      <div className="nav-button-container"><Link to={`/find-parties`}><button className="find-parties-button nav-button">Find Parties</button></Link></div>
      <div className="nav-button-container"><Link to={`/parties`}><button className="my-parties-button nav-button">My Parties</button></Link></div>
      <div className="nav-button-container logout-button-container"><button className="logout-button nav-button" onClick={() => {handleLogout()}}>Logout</button></div>
      <div className="icon" onClick={toggleNavbar}>☰</div>
    </div>
  )
}