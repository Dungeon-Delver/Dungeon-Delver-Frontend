import * as React from 'react'
import "./PartyCardMembersList.css"

export default function MembersList({visible, players, dm}) {
  const [hovering, setHovering] = React.useState(false);
  if(!visible) {
    return;
  }

  if(dm===null || players===null) {
    return;
  }

  return (
    <ul className="party-card-members" onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}>
        <li className="dm">
          <div className="dm-name member-name">👑 {dm.username}</div>
        </li>
        {players.map((item, i) => {
          if(hovering)
            return <li key={i} className="player">
              <div className="player-name member-name">{item.username}</div>
            </li>
          else {return ""}
        })}
      </ul>
  )
}