import * as React from 'react'
import "./SearchCard.css"
import { Link } from 'react-router-dom';
import SearchParamsList from '../SearchParamsList/SearchParamsList.jsx';
import classNames from 'classnames';

export default function SearchCard({party}) {
  return (
    <li className="search-party-card">
      <div className="search-party-image">
        <img src={party.image} alt={party.name}/>
      </div>
      <div className="search-party-title">{party.name}</div>
      <div className={classNames({"search-party-status": true, "green": party.status="public", "purple": party.status="private"})}>{party.status.charAt(0).toUpperCase() + party.status.slice(1)}</div>
      <SearchParamsList party={party} />
      <div className="enter-dungeon-button-container">
          <Link to={`/party/${party.objectId}`}>
            <button className="enter-dungeon-button"><span>Enter Dungeon</span></button>
        </Link>
        </div>
      </li>
  )
}