import * as React from 'react'
import "./PartyChat.css"

//Stretch
export default function PartyChat({party, inParty}) {
  if(inParty!=="dm" && inParty!=="player") {
    return <div className="party-chat">
      <h1>Join the party to see the chat!</h1>
    </div>
  }
  return (
    <div className="party-chat">
      
    </div>
  )
}