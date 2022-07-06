import * as React from 'react'
import "./NotFound.css"
import notFoundImg from "./not-found.jpeg"
import {Link} from "react-router-dom"


export default function NotFound() {
  return(
    <div className="NotFound">
      <h1 className="not-found-title">Error 404: Not Found</h1>
      <Link to={'/'}><img className="not-found-img" src={notFoundImg} alt="Error 404: Not Found" /></Link>
      <div className="not-found-text">We're sorry, the page you're looking for is unavailable. Click the guard if you would like to return to home.</div>
    </div>
  )
}