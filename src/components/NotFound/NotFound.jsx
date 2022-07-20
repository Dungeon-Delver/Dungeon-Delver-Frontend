import * as React from 'react'
import "./NotFound.css"
import notFoundImg from "./not-found.jpeg"
import {Link} from "react-router-dom"


export default function NotFound() {
  return(
    <div className="not-found">
      <h1 className="not-found-title">Error 404: Not Found</h1>
      <Link className="not-found-link" to={'/'}><div className="image-container"><img className="not-found-img" src={notFoundImg} alt="Error 404: Not Found" /></div></Link>
      <div className="not-found-text">We're sorry, the page you're looking for is unavailable. Click the guard if you would like to return to home.</div>
    </div>
  )
}