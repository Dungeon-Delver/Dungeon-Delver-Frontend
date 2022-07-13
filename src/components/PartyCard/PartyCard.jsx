import * as React from 'react'
import "./PartyCard.css"
import Keys from "../../keys.json"
import Parse from 'parse/dist/parse.min.js';
import { Link } from 'react-router-dom';

Parse.initialize(Keys.parse.appId, Keys.parse.javascriptKey)
Parse.serverURL = 'https://parseapi.back4app.com';

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
      <div className="members">
        <div className="dm">{dm}</div>
        {players.map((item, i) => {
          return <div key={i} className="player">{item}</div>
        })}
      </div>
      <div className="enter-dungeon-button-container"><Link to={`/party/${party.objectId}`}>
        <button className="enter-dungeon-button">Enter Dungeon</button>
        </Link></div>
      </div>
  )
}