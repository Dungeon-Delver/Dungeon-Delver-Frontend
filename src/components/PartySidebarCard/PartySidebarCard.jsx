import * as React from 'react'
import "./PartySidebarCard.css"
import { Link } from 'react-router-dom';

export default function PartySidebarCard({party, currentParty}) {
  return (
    <div className={currentParty.party.objectId===party.party.objectId ? "party-sidebar-card active" : "party-sidebar-card inactive"}>
      <Link to={`/party/${party.party.objectId}`}>
        <div className="party-image">
          <img src={party.party.image} alt={party.party.name}/>
        </div>
        <div className="party-title">{party.party.name}</div>
      </Link>
    </div>
  )
}