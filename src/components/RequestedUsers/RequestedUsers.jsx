import axios from 'axios'
import * as React from 'react'
import Constants from '../../constants/appConstants'
import "./RequestedUsers.css"

export default function RequestedUsers({requestedUsers, party}) {
  if(requestedUsers===null) {
    return
  }
  return (
    <li className="requested-users">
      {requestedUsers.map((item, i) => {
        return <RequestedUserCard party={party} key={i} user={item}/>
      })}
    </li>
  )
}

function RequestedUserCard({user, party}) {
  const URL = Constants().URL
  const getCurrentUser = Constants().getCurrentUser;
  const acceptUser = async () => {
    const currentUser = await getCurrentUser();
    await axios.post(`${URL}party/${party.objectId}/accept/${user.objectId}`, {dm: currentUser})
    
  }
  const rejectUser = async () => {
    const currentUser = await getCurrentUser();
    await axios.post(`${URL}party/${party.objectId}/reject/${user.objectId}`, {dm: currentUser})
  }
  return (
    <ul className="requested-user-card">
      <div className="user-image-container"><img className="user-image" src={user.picture} alt={user.username} /></div>
      <div className="requested-user-name">{user.username}</div>
      <button className="accept-user-button" onClick={acceptUser}>Accept Request</button>
      <button className="reject-user-button" onClick={rejectUser}>Reject Request</button>
    </ul>
  )
}