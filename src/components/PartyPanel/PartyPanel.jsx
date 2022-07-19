import {useState, useEffect}from 'react'
import "./PartyPanel.css"
import MembersList from "../PartyPanelMembersList/PartyPanelMembersList"
import RequestedUsers from "../RequestedUsers/RequestedUsers"
import CategoriesDisplay from "../CategoriesDisplay/CategoriesDisplay.jsx"
import axios from 'axios'
import Constants from '../../constants/appConstants'
import { useRecoilValue } from 'recoil'
import { navbarOpen } from '../../recoil/atoms/atoms'
import classNames from 'classnames'


export default function PartyPanel({party, inParty, fetchData}) {
  const openNavbar = useRecoilValue(navbarOpen);
  const [panelOpen, setOpenPanel] = useState(false);
  
  const togglePanel = () => {
    setOpenPanel(!panelOpen)
  }

  

  return (
    <div className={classNames({"party-panel": true, "responsive": panelOpen, "navbar-is-open": openNavbar})}>
      <div><h1 className="party-title">{party.party.name}</h1></div>
      <MembersList party={party} dm={party.members.dm} players={party.members.players} inParty={inParty} visible={inParty || (party.party.status!=="Closed")} maxDisplay={-1} />
      {inParty==="dm" ? <RequestedUsers party={party} requestedUsers={party.requestedUsers} fetchData={fetchData}/> : ""}
      <CategoriesDisplay party={party} inParty={inParty} fetchData={fetchData}/>
      <PanelButton party={party} inParty={inParty} requestedUsers={party.requestedUsers}/>
      <div className="party-panel-icon" onClick={togglePanel}>👤</div>
    </div>
  )
}

function PanelButton({party, inParty, requestedUsers}) {
  const [buttonText, setButtonText] = useState("Loading...")
  const [buttonDisabled, setButtonDisabled] = useState(true)
  const [onPress, setOnPress] = useState(() => {})
  const [justRequested, setJustRequested] = useState(false)

  const [error, setError] = useState("");

  const URL = Constants().URL;
  const getCurrentUser = Constants().getCurrentUser;

  useEffect(() => {
    const haveRequested = async () => {
      try {
        if(requestedUsers=== null) {
          return;
        }
        const userIds = requestedUsers.map((item) => {
          return item.objectId
        })
        const currentUser = await getCurrentUser();
        if(userIds.includes(currentUser.id) || justRequested) {
          setButtonDisabled(false)
          setOnPress(() => cancelRequest)
          setButtonText("Cancel Request")
        }
        else {
          setButtonText("Request to Join")
          setOnPress(() => requestJoin)
          setButtonDisabled(false)
        }
      }
      catch (err) {
        setError(err);
        console.error(err);
      }      
    }

    if(!inParty && (party.party.status==="Closed"||party.party.full)) {
      setButtonText("Party Closed")
      setButtonDisabled(true)
    }
    else if(inParty==="player") {
      setButtonText("Leave Party")
      setOnPress(() => leaveParty)
      setButtonDisabled(false)
    }
    else if(inParty==="dm") {
      setButtonText("Delete Party")
      setOnPress(() => deleteParty)
      setButtonDisabled(false)
    }
    else {
      haveRequested();
    }
    setJustRequested(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestedUsers])

  const requestJoin = async () => {
    try {
      setButtonDisabled(true)
      setButtonText("Sending Request")
      const currentUser = await getCurrentUser();
      await axios.post(`${URL}user/${party.party.objectId}/join`, {userId: currentUser})
      setButtonDisabled(false)
      setOnPress(() => cancelRequest)
      setButtonText("Cancel Request")
    }
    catch (err) {
      setError(err);
      console.error(err)
    }
  }

  const leaveParty = async () => {
    try {
      setButtonText("Leaving party")
      setButtonDisabled(true)
      const currentUser = await getCurrentUser();
      await axios.post(`${URL}user/${party.party.objectId}/leave`, {userId: currentUser})
      setButtonText("Successfully left party")
    }
    catch (err) {
      setError(err);
      console.error(err)
    }
  }

  const cancelRequest = async () => {
    try {
      setButtonText("Cancelling Request")
      setButtonDisabled(true)
      const currentUser = await getCurrentUser();
      await axios.post(`${URL}user/${party.party.objectId}/cancel-join`, {userId: currentUser})
      setButtonText("Successfully cancelled request")
      setJustRequested(false)
    }
    catch (err) {
      setError(err);
      console.error(err)
    }
  }

  const deleteParty = async () => {
    try {
      setButtonText("Deleting Party")
      setButtonDisabled(true)
      const currentUser = await getCurrentUser();
      await axios.post(`${URL}party/${party.party.objectId}/delete`, {dm: currentUser})
      setButtonText("Successfully deleted party")
      setJustRequested(false)
    }
    catch (err) {
      setError(err);
      console.error(err)
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