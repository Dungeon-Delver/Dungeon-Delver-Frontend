import * as React from 'react'
import "./PartyCard.css"
import Keys from "../../keys.json"
import Parse from 'parse/dist/parse.min.js';

Parse.initialize(Keys.parse.appId, Keys.parse.javascriptKey)
Parse.serverURL = 'https://parseapi.back4app.com';

export default function PartyCard({party, role}) {
  const [dm, setDm] = React.useState("")
  const [players, setPlayers] = React.useState("")

  React.useEffect(() => {
    //Use parse to find dm, players of party
  })
  return (
    <div className="party-card">
      <div className="party-image">
        <img src={party.image} alt={party.name}/>
      </div>
      <div className="party-title">{party.name}</div>
      <div className="role">{role}</div>
      <div className="members">
        <div className="dm">{}</div>
      </div>
      </div>
  )
}