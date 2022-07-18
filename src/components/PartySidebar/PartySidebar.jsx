import axios from 'axios'
import * as React from 'react'
import './PartySidebar.css'
import Constants from '../../constants/appConstants'
import Loader from '../Loader/Loader'
import PartySidebarCard from "../PartySidebarCard/PartySidebarCard"

export default function PartySidebar({currentParty}) {
  const URL = Constants().URL;
  const [parties, setParties] = React.useState(null);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const getCurrentUser = Constants().getCurrentUser;

  React.useEffect( () => {
    const getParties = async () => {
      try{
        const user = await getCurrentUser();
        const res = await axios.get(`${URL}user/${user.id}/parties`)
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
    <div className="party-list">
        {parties!=null ? 
         <div className="parties-list">
          {parties.dmParties.slice(0).reverse().map((item, i) => {
            return <PartySidebarCard key={i} currentParty={currentParty} party={item} role={"Dungeon Master"}/>
          })}
          {parties.playerParties.slice(0).reverse().map((item, i) => {
            return <PartySidebarCard key={i} currentParty={currentParty} party={item} role={"Player"}/>
          })}
        </div>
        : <h2 className="no-parties">You are not currently in any parties. Find or create one to begin!</h2>}
    </div>
  )
}