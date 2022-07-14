import * as React from 'react'
import "./PartyPanel.css"
import MembersList from "../MembersList/MembersList"
import CategoriesDisplay from "../CategoriesDisplay/CategoriesDisplay.jsx"
import axios from 'axios'
import Constants from '../../constants/appConstants'

export default function PartyPanel({party, inParty}) {
  const [buttonText, setButtonText] = React.useState("")
  const [buttonDisabled, setButtonDisabled] = React.useState(false)
  const [onPress, setOnPress] = React.useState(() => {})

  const URL = Constants().URL;
  const getCurrentUser = Constants().getCurrentUser;

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
      setOnPress(() => requestJoin)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const requestJoin = async () => {
    try {
      const currentUser = await getCurrentUser();
      await axios.post(`${URL}user/${party.objectId}/join`, {userId: currentUser})
    }
    catch (err) {
      console.log(err)
    }
  }
  return (
    <div className="party-panel">
      <MembersList party={party} visible={!inParty && (party.status==="Closed")} maxDisplay={-1} />
      <CategoriesDisplay party={party} />
      <button disabled={buttonDisabled} onClick={() => onPress()}>{buttonText}</button>
    </div>
  )
}