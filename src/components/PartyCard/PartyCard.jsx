import * as React from 'react'
import "./PartyCard.css"
import { Link } from 'react-router-dom';
import MembersList from '../PartyCardMembersList/PartyCardMembersList';
import axios from 'axios';
import Constants from '../../constants/appConstants';

export default function PartyCard({party, role}) {
  const URL = Constants().URL
  const [members, setMembers] = React.useState(null)
  React.useEffect(() => {
    const setup = async () => {
      const result = await axios.get(`${URL}party/${party.objectId}/members`)
      const members = result.data.result
      setMembers(members);
    }
    setup()
  }, [])
  if(members === null) {
    return null;
  }
  return (
    <div className="party-card">
      <div className="party-image">
        <img src={party.image} alt={party.name}/>
      </div>
      <div className="party-title">{party.name}</div>
      <div className={"party-role " + (role==="Player" ? "green" : "purple")}>{role}</div>
      <MembersList dm={members.dm} players={members.players} visible={true}/>
      <div className="enter-dungeon-button-container">
          <Link to={`/party/${party.objectId}`}>
            <button className="enter-dungeon-button"><span>Enter Dungeon</span></button>
        </Link>
        </div>
      </div>
  )
}