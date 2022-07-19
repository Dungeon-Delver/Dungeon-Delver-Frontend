import axios from 'axios'
import {useState} from 'react'
import Constants from '../../constants/appConstants'
import "./RequestedUsers.css"

export default function RequestedUsers({requestedUsers, party, fetchData}) {
  if(requestedUsers===null) {
    return
  }
  return (
    <ul className="requested-users">
      <h3 className="requested-users-title">Join Requests</h3>
      {requestedUsers.map((item, i) => {
        return <RequestedUserCard party={party.party} fetchData={fetchData} key={i} user={item}/>
      })}
    </ul>
  )
}

function RequestedUserCard({user, party, fetchData}) {
  const URL = Constants().URL
  const [acceptButtonText, setAcceptButtonText] = useState("Accept Request")
  const [rejectButtonText, setRejectButtonText] = useState("Reject Request")
  const [buttonsDisabled, setButtonsDisabled] = useState(false)
  const getCurrentUser = Constants().getCurrentUser;
  const acceptUser = async () => {
    setAcceptButtonText("Accepting...")
    const currentUser = await getCurrentUser();
    setButtonsDisabled(true)
    await axios.post(`${URL}party/${party.objectId}/accept/${user.objectId}`, {dm: currentUser})
    fetchData();
  }
  const rejectUser = async () => {
    setRejectButtonText("Rejecting...")
    setButtonsDisabled(true)
    const currentUser = await getCurrentUser();
    await axios.post(`${URL}party/${party.objectId}/reject/${user.objectId}`, {dm: currentUser})
    fetchData();
  }
  return (
    <li className="requested-user-card">
      <div className="user-image-container"><img className="user-image" src={user.picture} alt={user.username} /></div>
      <div className="requested-user-name">{user.username}</div>
      <button className="accept-user-button" disabled={buttonsDisabled} onClick={acceptUser}>{acceptButtonText}</button>
      <button className="reject-user-button" disabled={buttonsDisabled} onClick={rejectUser}>{rejectButtonText}</button>
    </li>
  )
}