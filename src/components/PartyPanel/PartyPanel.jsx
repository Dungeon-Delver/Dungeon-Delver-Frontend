import * as React from 'react'
import "./PartyPanel.css"
import MembersList from "../MembersList/MembersList"
import CategoriesDisplay from "../CategoriesDisplay/CategoriesDisplay.jsx"
import axios from 'axios'
import Constants from '../../constants/appConstants'

export default function PartyPanel({party, inParty}) {

  return (
    <div className="party-panel">
      <MembersList party={party} visible={!inParty && (party.status==="Closed")} maxDisplay={-1} />
      <CategoriesDisplay party={party} />
      <PanelButton party={party} inParty={inParty}/>
    </div>
  )
}

function PanelButton({party, inParty}) {
  const [buttonText, setButtonText] = React.useState("Loading...")
  const [buttonDisabled, setButtonDisabled] = React.useState(false)
  const [onPress, setOnPress] = React.useState(() => {})

  const [error, setError] = React.useState("");

  const URL = Constants().URL;
  const getCurrentUser = Constants().getCurrentUser;

  React.useEffect(() => {
    const haveRequested = async () => {
      try {
        const response = await axios.get(`${URL}party/${party.objectId}/requested`)
        const users = response.data.users
        const userIds = users.map((item) => {
          return item.objectId
        })
        console.log('userIds: ', userIds);
        const currentUser = await getCurrentUser();
        if(userIds.includes(currentUser.id)) {
          setButtonDisabled(true)
          setButtonText("Request Sent")
        }
        else {
          setButtonText("Request to Join")
          setOnPress(() => requestJoin)
        }
      }
      catch (err) {
        setError(err);
        console.log(err);
      }      
    }

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
      haveRequested();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const requestJoin = async () => {
    try {
      const currentUser = await getCurrentUser();
      await axios.post(`${URL}user/${party.objectId}/join`, {userId: currentUser})
    }
    catch (err) {
      setError(err);
      console.log(err)
    }
  }

  return(
    <div className="panel-button"><button disabled={buttonDisabled} onClick={() => onPress()}>{buttonText}</button>
      {error !=="" ?<div className="party-page-failed"> 
        <h1 className="party-page-failed-message">{error.response.data ? error.response.data.error.message : error.message}</h1>
        <h2 className="party-page-failed-status-text">{error.statusText}</h2>
      </div> :""}
    </div>
  )
}