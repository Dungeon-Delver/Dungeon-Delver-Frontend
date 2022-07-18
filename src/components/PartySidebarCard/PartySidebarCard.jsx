import * as React from 'react'
import "./PartySidebarCard.css"
import { Link } from 'react-router-dom';
import classNames from 'classnames';

export default function PartySidebarCard({party, currentParty}) {
  return (
    <li className={classNames({"party-sidebar-card": true, "active": currentParty.party.objectId===party.party.objectId, "inactive": currentParty.party.objectId!==party.party.objectId })}>
      <Link to={`/party/${party.party.objectId}`}>
        <div className="party-image">
          <img src={party.party.image} alt={party.party.name}/>
        </div>
        <div className="party-title">{party.party.name}</div>
      </Link>
    </li>
  )
}