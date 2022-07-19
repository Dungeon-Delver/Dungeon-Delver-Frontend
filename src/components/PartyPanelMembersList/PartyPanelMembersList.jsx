import classNames from 'classnames';
import * as React from 'react'
import "./PartyPanelMembersList.css"

export default function MembersList({players, dm, inParty}) {

  if(dm===null || players===null) {
    return;
  }

  return (
    <ul className={classNames({"panel-party-members": true, "panel-party-members-dm": inParty==="dm"})}>
      <h2 className="party-members-heading">Current Members</h2>
        <li className="player">
          <div className="dm-picture member-picture"><img src={dm.picture} alt={dm.name}/></div>
          <div className="dm-name member-name">👑 {dm.username}</div>
          {inParty==="dm" ? <button><span class='text'>Remove User</span><span className="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"/></svg></span></button> : ""}
        </li>
        {players.map((item, i) => {
          return <li key={i} className="player">
              <div className="player-picture member-picture"><img src={item.picture} alt={item.name}/></div>
              <div className="player-name member-name">{item.username}</div>
              {inParty==="dm" ? <button><span>Remove User</span></button> : ""}
            </li>
        })}
      </ul>
  )
}