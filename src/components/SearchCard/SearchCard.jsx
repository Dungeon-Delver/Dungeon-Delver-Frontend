import * as React from 'react'
import "./SearchCard.css"
import { Link } from 'react-router-dom';
import SearchParamsList from '../SearchParamsList/SearchParamsList.jsx';

export default function SearchCard({party}) {
  function getGradient(ratio) {
    var color1 = '90ee90'; // lightgreen
    var color2 = 'FF0000'; // red
    var hex = function(x) {
        x = x.toString(16);
        return (x.length === 1) ? '0' + x : x;
    };

    var r = Math.ceil(parseInt(color1.substring(0,2), 16) * ratio + parseInt(color2.substring(0,2), 16) * (1-ratio));
    var g = Math.ceil(parseInt(color1.substring(2,4), 16) * ratio + parseInt(color2.substring(2,4), 16) * (1-ratio));
    var b = Math.ceil(parseInt(color1.substring(4,6), 16) * ratio + parseInt(color2.substring(4,6), 16) * (1-ratio));
    return '#' + hex(r) + hex(g) + hex(b);
  }
  return (
    <li className="search-party-card">
      <div className="search-party-image">
        <img src={party.image} alt={party.name}/>
      </div>
      <div className="search-party-title">{party.name}</div>
      <div className="search-party-status" style={{backgroundColor: getGradient((party.relevance)/100)}}>{party.relevance}</div>
      <SearchParamsList party={party} />
      <div className="enter-dungeon-button-container">
          <Link to={`/party/${party.objectId}`}>
            <button className="enter-dungeon-button"><span>Enter Dungeon</span></button>
        </Link>
        </div>
      </li>
  )
}