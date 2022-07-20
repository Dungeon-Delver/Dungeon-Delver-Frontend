import axios from 'axios';
import classNames from 'classnames';
import {useState}from 'react'
import { BACKEND_URL } from '../../constants/constants';
import GetCurrentUser from '../../constants/GetCurrentUser';
import "./PartyPanelMembersList.css"

export default function MembersList({party, players, dm, inParty}) {

  if(dm===null || players===null) {
    return;
  }


  return (
    <ul className={classNames({"panel-party-members": true, "panel-party-members-dm": inParty==="dm"})}>
      <h2 className="party-members-heading">Current Members</h2>
        <li className="dm">
          <div className="dm-picture member-picture"><img src={dm.picture} alt={dm.name}/></div>
          <div className="dm-name member-name">👑 {dm.username}</div>
        </li>
        {players.map((item, i) => {
          return <li key={i} className="player">
              <div className="player-picture member-picture"><img src={item.picture} alt={item.name}/></div>
              <div className="player-name member-name">{item.username}</div>
              {inParty==="dm" ? <RemoveUserButton item={item} dm={dm} party={party}/>: ""}
            </li>
        })}
      </ul>
  )
}

function RemoveUserButton({item, dm, party}) {

  const [buttonText, setButtonText] = useState("Remove User")
  const [error, setError] = useState("")

  const getCurrentUser = GetCurrentUser()

  const removeUser = async(playerId) => {
    try {
      setButtonText("Removing User")
      const currentUser = await getCurrentUser();
      await axios.post(`${BACKEND_URL}party/${party.party.objectId}/remove/${playerId}`, {dm : currentUser})
      setButtonText("Removed User")
    }
    catch (err) {
      setError(err);
      console.error(err)
    }
  }
  return (
    <>
     <button disabled={!(buttonText==="Remove User")} onClick={() =>(removeUser(item.objectId))}><span className='text'>{buttonText}</span><span className="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"/></svg></span></button>
      {error==="" ? "" : <h3 className="remove-failed-message">{error.response.data ? error.response.data.error.message : error.message}</h3>}
    </>
  )

}