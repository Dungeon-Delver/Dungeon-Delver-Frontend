import axios from 'axios'
import * as React from 'react'
import { Link } from 'react-router-dom'
import './MyParties.css'

export default function MyParties() {
  const [parties, setParties] = React.useState();
  React.useEffect(() => {

  }, [])

  return (
    <div className="my-parties">
      <Link to={`/create-party`}><button className="create-party-button">Create a Party</button></Link>
    </div>
  )
}