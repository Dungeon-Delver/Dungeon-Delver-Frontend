import * as React from 'react'
import "./PartyCard.css"

export default function PartyCard({party}) {

  return (
    <div className="party-card">{party.name}</div>
  )
}