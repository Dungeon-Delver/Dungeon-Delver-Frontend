import * as React from 'react'
import "./PartyCard.css"
import { Link } from 'react-router-dom';
import MembersList from '../PartyCardMembersList/PartyCardMembersList';

export default function PartyCard({party, role}) {
  return (
    <li className="party-card">
      <div className="party-image">
        <img src={party.party.image} alt={party.party.name}/>
      </div>
      <div className="party-title">{party.party.name}</div>
      <div className={"party-role " + (role==="Player" ? "green" : "purple")}>{role}</div>
      <MembersList dm={party.dm} players={party.players} visible={true}/>
      <div className="enter-dungeon-button-container">
          <Link to={`/party/${party.party.objectId}`}>
            <button className="enter-dungeon-button"><span>Enter Dungeon</span></button>
        </Link>
        </div>
      </li>
  )
}