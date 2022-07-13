import axios from 'axios'
import * as React from 'react'
import { Link } from 'react-router-dom'
import './MyParties.css'
import Constants from '../../constants/appConstants'

export default function MyParties() {
  const URL = Constants().URL;
  const [parties, setParties] = React.useState([]);
  const [error, setError] = React.useState("");
  const getCurrentUser = Constants().getCurrentUser;

  React.useEffect( () => {
    const getParties = async () => {
      try{
        const user = await getCurrentUser();
        const res = await axios.get(`${URL}user/${user.id}/parties`)
        console.log('res: ', res);
      }
      catch (err) {
        console.log(err)
        setError(err);
      }
      
    }
    getParties()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="my-parties">
      <Link to={`/create-party`}><button className="create-party-button">Create a Party</button></Link>
    </div>
  )
}