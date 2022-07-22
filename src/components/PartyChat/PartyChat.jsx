import {useState} from 'react'
import "./PartyChat.css"
import useChat from "../../hooks/useChat"
import classNames from 'classnames'

//Stretch
export default function PartyChat({party, inParty}) {
  const partyId = party.party.objectId
  const {messages, sendMessage} = useChat(partyId)
  const [newMessage, setNewMessage] = useState("")

  const handleNewMessageChange = (event) => {
    setNewMessage(event.target.value);
  }

  const handleSendMessage = () => {
    sendMessage(newMessage);
    setNewMessage("");
  };


  if(inParty!=="dm" && inParty!=="player") {
    return <div className="party-chat">
      <h1>Join the party to see the chat!</h1>
    </div>
  }


  return (
    <div className="party-chat">
      <ol className="messages-list">
        {messages.map((message, i) => {
          <li
          key={i}
          className={classNames({"message-item": true, "my-message": message.ownedByCurrentUser, "received-message": !message.ownedByCurrentUser})}>
            {message.body}
          </li>
        })}
      </ol>
      <textarea
        value={newMessage}
        onChange={handleNewMessageChange}
        placeholder="Write message..."
        className="new-message-input-field"
      />
      <button onClick={handleSendMessage} className="send-message-button">
        Send
      </button>
    </div>
  )
}