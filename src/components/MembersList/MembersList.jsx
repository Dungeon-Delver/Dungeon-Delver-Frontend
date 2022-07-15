import * as React from 'react'
import "./MembersList.css"

export default function MembersList({maxDisplay, players, dm}) {
  console.log('dm: ', dm);
  const [hovering, setHovering] = React.useState(false);

  if(dm===null || players===null) {
    return;
  }

  return (
    <ul className="party-members" onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}>
        <li className="dm">
          <div className="dm-picture member-picture user-image-container"><img src={dm.picture} alt={dm.name}/></div>
          <div className="dm-name member-name">👑 {dm.username}</div>
        </li>
        {players.map((item, i) => {
          if(!hovering && (maxDisplay === -1 ? true : i <=maxDisplay) )
            return <li key={i} className="player">
              <div className="user-image-container player-picture member-picture"><img src={item.picture} alt={item.name}/></div>
              <div className="player-name member-name">{item.username}</div>
            </li>
          else {return ""}
        })}
      </ul>
  )
}