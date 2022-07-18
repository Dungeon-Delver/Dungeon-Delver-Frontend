import * as React from 'react'
import "./PartyPanelMembersList.css"

export default function MembersList({players, dm}) {

  if(dm===null || players===null) {
    return;
  }

  return (
    <ul className="panel-party-members">
      <h2 className="party-members-heading">Current Members</h2>
        <li className="dm">
          <div className="dm-picture member-picture"><img src={dm.picture} alt={dm.name}/></div>
          <div className="dm-name member-name">👑 {dm.username}</div>
        </li>
        {players.map((item, i) => {
          return <li key={i} className="player">
              <div className="player-picture member-picture"><img src={item.picture} alt={item.name}/></div>
              <div className="player-name member-name">{item.username}</div>
            </li>
        })}
      </ul>
  )
}