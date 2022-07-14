import axios from 'axios'
import * as React from 'react'
import { Link } from 'react-router-dom'
import './MyParties.css'
import Constants from '../../constants/appConstants'
import Loader from '../Loader/Loader'
import PartyCard from "../PartyCard/PartyCard.jsx"
import { useRecoilValue } from 'recoil'
import { currentUser } from '../../recoil/atoms/atoms'

export default function MyParties() {
  const URL = Constants().URL;
  const [parties, setParties] = React.useState(null);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const getCurrentUser = Constants().getCurrentUser;
  const curUser = useRecoilValue(currentUser)

  React.useEffect( () => {
    const getParties = async () => {
      try{
        const user = await getCurrentUser();
        const res = await axios.get(`${URL}user/${user.id}/parties`)
        setParties(res.data.parties)
        setLoading(false)
      }
      catch (err) {
        console.log(err)
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
      <div className="parties">
        {parties.map((item, i) => {
          return <PartyCard key={`${i}${item.objectId}`} party={item} role={item.dm.objectId===curUser.id ? "Dungeon Master" : "Player"}/>
        })}
      </div>
    </div>
  )
}