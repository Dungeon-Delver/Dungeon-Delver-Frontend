import * as React from 'react'
import "./PartyCard.css"
import Parse from "../../constants/parseInitialize"
import { Link } from 'react-router-dom';



export default function PartyCard({party, role}) {
  const [dm, setDm] = React.useState("")
  const [players, setPlayers] = React.useState([])

  React.useEffect(() => {
    //Use parse to find dm, players of party
    const getDM = async () => {
      try {
        const query = new Parse.Query("User");
        const dungeonMaster = await query.get(party.dm.objectId);
        const name = dungeonMaster.get("username");
        setDm(name)
      }
      catch (err) {
        console.error(err)
      }
    }
    const getPlayers = async () => {
      //Get players from relation
    }
    getDM()
    getPlayers()
  })
  return (
    <div className="party-card">
      <div className="party-image">
        <img src={party.image} alt={party.name}/>
      </div>
      <div className="party-title">{party.name}</div>
      <div className="role">{role}</div>
      <ul className="members">
        <li className="dm">{dm}</li>
        {players.map((item, i) => {
          return <li key={i} className="player">{item}</li>
        })}
      </ul>
      <div className="enter-dungeon-button-container"><Link to={`/party/${party.objectId}`}>
        <button className="enter-dungeon-button">Enter Dungeon</button>
        </Link></div>
      </div>
  )
}