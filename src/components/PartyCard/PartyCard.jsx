import * as React from 'react'
import "./PartyCard.css"
import Parse from "../../constants/parseInitialize"
import { Link } from 'react-router-dom';
import MembersList from '../MembersList/MembersList';



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
      <div className={"party-role " + role==="Player" ? "green" : "purple"}>{role}</div>
      <MembersList dm={dm} players={players} maxDisplay={2}/>
      <div className="enter-dungeon-button-container">
          <Link to={`/party/${party.objectId}`}>
            <button className="enter-dungeon-button"><span>Enter Dungeon</span></button>
        </Link>
        </div>
      </div>
  )
}