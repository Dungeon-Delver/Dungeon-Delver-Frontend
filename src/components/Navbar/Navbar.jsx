import * as React from 'react'
import "./Navbar.css"

export default function Navbar({handleLogout}) {
  return (
    <div className="navbar">
      <button className="logout-button" onClick={() => {handleLogout()}}>Logout</button>
    </div>
  )
}