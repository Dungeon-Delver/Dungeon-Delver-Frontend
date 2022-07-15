import * as React from 'react'
import "./PartyPanel.css"
import MembersList from "../MembersList/MembersList"
import RequestedUsers from "../RequestedUsers/RequestedUsers"
import CategoriesDisplay from "../CategoriesDisplay/CategoriesDisplay.jsx"
import axios from 'axios'
import Constants from '../../constants/appConstants'
import Parse from '../../constants/parseInitialize'

export default function PartyPanel({party, inParty}) {
  const URL = Constants().URL;
  const [requestedUsers, setRequestedUsers]  = React.useState(null)

  const [dm, setDm] = React.useState("")
  const [players, setPlayers] = React.useState([])

  React.useEffect( () => {
    const getMembers = async () => {
      try {
        const response = await axios.get(`${URL}party/${party.objectId}/members`);
        console.log('response: ', response);
        setDm(response.data.result.dm)
        setPlayers(response.data.result.players)
      }
      catch (err) {
        console.error(err)
      }
    }

    const getRequestedUsers = async () => {
      const response = await axios.get(`${URL}party/${party.objectId}/requested`)
      const users = response.data.users
      setRequestedUsers(users)
    }
    getMembers()
    getRequestedUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

  return (
    <div className="party-panel">
      {party.status==="Public" || inParty==="player" || inParty==="dm" ? <MembersList dm={dm} players={players} visible={!inParty && (party.status==="Closed")} maxDisplay={-1} /> : ""}
      {inParty==="dm" ? <RequestedUsers party={party} requestedUsers={requestedUsers}/> : ""}
      <CategoriesDisplay party={party} />
      <PanelButton party={party} inParty={inParty} requestedUsers={requestedUsers}/>
    </div>
  )
}

function PanelButton({party, inParty, requestedUsers}) {
  const [buttonText, setButtonText] = React.useState("Loading...")
  const [buttonDisabled, setButtonDisabled] = React.useState(true)
  const [onPress, setOnPress] = React.useState(() => {})

  const [error, setError] = React.useState("");

  const URL = Constants().URL;
  const getCurrentUser = Constants().getCurrentUser;

  React.useEffect(() => {
    const haveRequested = async () => {
      try {
        if(requestedUsers=== null) {
          return;
        }
        const userIds = requestedUsers.map((item) => {
          return item.objectId
        })
        const currentUser = await getCurrentUser();
        if(userIds.includes(currentUser.id)) {
          setButtonDisabled(true)
          setButtonText("Request Sent")
        }
        else {
          setButtonText("Request to Join")
          setOnPress(() => requestJoin)
          setButtonDisabled(false)
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
      setButtonDisabled(false)
    }
    else if(inParty==="dm") {
      setButtonText("Delete Party")
      setButtonDisabled(false)
    }
    else {
      haveRequested();
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestedUsers])

  const requestJoin = async () => {
    try {
      const currentUser = await getCurrentUser();
      await axios.post(`${URL}user/${party.objectId}/join`, {userId: currentUser})
      setButtonDisabled(true)
      setButtonText("Request Sent")
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