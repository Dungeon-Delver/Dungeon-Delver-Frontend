import axios from 'axios'
import {useState, useEffect}from 'react'
import { Link } from 'react-router-dom'
import './MyParties.css'
import GetCurrentUser from '../../constants/GetCurrentUser'
import Loader from '../Loader/Loader'
import PartyCard from "../PartyCard/PartyCard.jsx"
import { BACKEND_URL } from '../../constants/constants'

export default function MyParties() {
  const [parties, setParties] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const getCurrentUser = GetCurrentUser();

  useEffect( () => {
    const getParties = async () => {
      try{
        const user = await getCurrentUser();
        const res = await axios.get(`${BACKEND_URL}user/${user.id}/parties`)
        setParties(res.data.parties)
        setLoading(false)
      }
      catch (err) {
        console.error(err)
        setError(err);
        setLoading(false)
      }
    }
    setLoading(true)
    getParties()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  if(loading) {
    return (
      <Loader />
    )
  }

  if(error) {
    return (
      <div className="my-parties">
        <Link to={`/create-party`}><button className="create-party-button">Create a Party</button></Link>
        <div className="error">
          <h1 className="error-message">{error.response.data ? error.response.data.error.message : error.message}</h1>
        </div>
      </div>
    )
  }
  if(parties===null) {
    return(<Loader />)
  }
  return (
    <div className="my-parties">
      <Link to={`/create-party`}><button className="create-new-party-button">Create a Party</button></Link>
        {parties!=null ? 
         <ul className="parties">
          {parties.dmParties.map((item, i) => {
            return <PartyCard key={i} party={item} role={"Dungeon Master"}/>
          })}
          {parties.playerParties.map((item, i) => {
            return <PartyCard key={i} party={item} role={"Player"}/>
          })}
        </ul>
        : <h2 className="no-parties">You are not currently in any parties. Find or create one to begin!</h2>}
    </div>
  )
}