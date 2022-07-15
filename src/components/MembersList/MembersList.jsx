import * as React from 'react'
import "./MembersList.css"

export default function MembersList({maxDisplay, players, dm}) {
  const [hovering, setHovering] = React.useState(false);
  return (
    <ul className="party-members" onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}>
        <li className="dm">👑 {dm}</li>
        {players.map((item, i) => {
          if(!hovering && (maxDisplay === -1 ? true : i <=maxDisplay) )
            return <li key={i} className="player">{item}</li>
          else {return ""}
        })}
      </ul>
  )
}