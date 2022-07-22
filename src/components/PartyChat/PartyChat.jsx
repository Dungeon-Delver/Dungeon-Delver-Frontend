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
    if(newMessage !== "") {
      sendMessage(newMessage);
      setNewMessage("");
    }
  };


  const handleKeyDown = (event) => {
    if(event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      handleSendMessage();
    }
  }


  if((inParty!=="dm" && inParty!=="player")&&party.status!=="Public") {
    return (<div className="party-chat">
      <h1>Only party members can see the chat!</h1>
    </div>)
  }


  return (
    <div className="party-chat">
      <ol className="messages-list">
        {messages.map((message, i) => {
          return(<ChatMessage key={i} message={message} prevMessage={i === 0 ? true : messages[i-1]}/>)
        })}
      </ol>
      {inParty==="dm" || inParty==="player" ? <><textarea
        value={newMessage}
        onChange={handleNewMessageChange}
        onKeyDown={(event) => handleKeyDown(event)}
        placeholder="Write message..."
        className="new-message-input-field" /><button onClick={handleSendMessage} className="send-message-button">
          Send
        </button></> : ""}
      
    </div>
  )
}

function ChatMessage({message, prevMessage}) {
  const newSender = prevMessage===true || prevMessage.senderId !== message.senderId
  return (<li
    className={classNames({"message-item": true, "my-message": message.ownedByCurrentUser, "received-message": !message.ownedByCurrentUser, "new-sender" : newSender})}>
      {newSender ?
        <><div className="chat-img-container"><img src={message.user.picture} alt={message.user.name} /></div><div className="chat-user">{message.user.username}</div></>
      : ""}
      <div className="message-body">{message.body}</div>
    </li>)
  }