import axios from "axios";
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import { BACKEND_URL } from "../../constants/constants";
import Loader from "../Loader/Loader";
import NotFound from "../NotFound/NotFound";
import PartyCard from "../PartyCard/PartyCard";
import "./UserProfile.css"

export default function UserProfile() {
  const params = useParams();

  const [parties, setParties] = useState(null);
  const [user, setUser] = useState(undefined)
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect( () => {
    const getProfile = async () => {
      try{
        const res = await axios.get(`${BACKEND_URL}user/${params.userId}/profile`)
        setUser(res.data.data.user)
        setParties(res.data.data.parties)
        setLoading(false)
      }
      catch (err) {
        console.error(err)
        setError(err);
        if(err.response.status===404) {
          setUser("Not Found")
        }
        else {
          setUser(null);
          setError(err)
        }
        setLoading(false)
      }
    }
    setLoading(true)
    getProfile()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])
  if(loading) {
    return (
      <Loader />
    )
  }
  if(user==="Not Found") {
    return(<NotFound />)
  }

  if(error) {
    return (
      <div className="user-failed"> 
        <h1 className="user-failed-message">{error.response.data ? error.response.data.error.message : error.message}</h1>
        <h2 className="user-failed-status-text">{error.statusText}</h2>
      </div>
    )
  }

  if(user===undefined) {
    return <Loader />
  }

  const userDate = new Date(user.createdAt)
  const dateOptions ={ year: 'numeric', month: 'short', day: 'numeric' };

  
  return (
    <div className="user-profile">
      <div className="user-data-container">
        <div className="user-data">
          <div className="user-picture-and-name">
            <div className="user-profile-image-container">
              <img src={user.picture} alt={user.username} />
            </div>
            <h1 className="user-profile-name">{user.username}</h1>
          </div>
          <div className="user-profile-date-joined">{`Delving since ${userDate.toLocaleDateString(userDate, dateOptions)}`}</div>
        </div>
      </div>
        {parties.playerParties.length > 0 || parties.dmParties.length > 0 ? 
        <><h2>{`${user.username}'s Public Parties`}</h2>
        <ul className="parties">
          {parties.dmParties.map((item, i) => {
            return <PartyCard key={i} party={item} role={"Dungeon Master"} />;
          })}
          {parties.playerParties.map((item, i) => {
            return <PartyCard key={i} party={item} role={"Player"} />;
          })}
        </ul></>
        : <h2 className="no-parties">This user is not currently in any public parties</h2>}
    </div>
  )
}