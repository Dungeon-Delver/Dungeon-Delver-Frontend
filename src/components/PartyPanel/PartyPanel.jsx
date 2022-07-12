import * as React from 'react'
import "./PartyPanel.css"
import MembersList from "../MembersList/MembersList"
import CategoriesDisplay from "../CategoriesDisplay/CategoriesDisplay.jsx"

export default function PartyPanel({party, inParty}) {
  const [buttonText, setButtonText] = React.useState("");
  const [buttonDisabled, setButtonDisabled] = React.useState(false)

  React.useEffect(() => {
    if(!inParty && (party.status==="Closed"||party.full)) {
      setButtonText("Party Closed")
      setButtonDisabled(true)
    }
    else if(inParty==="player") {
      setButtonText("Leave Party")
    }
    else if(inParty==="dm") {
      setButtonText("Delete Party")
    }
    else {
      setButtonText("Request to Join")
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="party-panel">
      <MembersList party={party} visible={!inParty && (party.status==="Closed")} maxDisplay={-1} />
      <CategoriesDisplay party={party} />
      <button disabled={buttonDisabled}>{buttonText}</button>
    </div>
  )
}