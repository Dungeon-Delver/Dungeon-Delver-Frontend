import * as React from 'react'
import "./PartySidebarCard.css"
import { Link } from 'react-router-dom';

export default function PartySidebarCard({party}) {
  return (
    <div className="party-sidebar-card">
      <Link to={`/party/${party.party.objectId}`}>
        <div className="party-image">
          <img src={party.party.image} alt={party.party.name}/>
        </div>
        <div className="party-title">{party.party.name}</div>
      </Link>
    </div>
  )
}