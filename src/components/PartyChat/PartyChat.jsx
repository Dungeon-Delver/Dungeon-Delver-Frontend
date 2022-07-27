import {useEffect, useRef, useState} from 'react'
import "./PartyChat.css"
import useChat from "../../hooks/useChat"
import classNames from 'classnames'
import ReactTextareaAutosize from 'react-textarea-autosize'
import { useRecoilValue } from 'recoil'
import { currentUser, navbarOpen } from '../../recoil/atoms/atoms'
import axios from 'axios'
import { BACKEND_URL } from '../../constants/constants'

//Stretch
export default function PartyChat({party, inParty}) {
  const partyId = party.party.objectId
  const [messages, setMessages] = useState([]);
  const [lastMessage, setLastMessage] = useState(null)
  const [newMessage, setNewMessage] = useState("")
  const openNavbar = useRecoilValue(navbarOpen);
  const [loadingMessages, setLoadingMessages] = useState(true)
  const user = useRecoilValue(currentUser)
  const [reachedTop, setReachedTop] = useState(false)
  const [pendingMessages, setPendingMessages] = useState([])
  const {sendMessage} = useChat(partyId, setMessages, setLastMessage, pendingMessages, setPendingMessages)

  const messagesListBottom = useRef(null);

  const loadMore = async (firstMessage) => {
    setLoadingMessages(true)
    try {
      let response
      if(firstMessage!=null) {
        response = await axios.post(`${BACKEND_URL}party/${partyId}/messages/`, {firstMessage: firstMessage, userId: user.id})
      }
      else {
        response = await axios.post(`${BACKEND_URL}party/${partyId}/messages/`, {userId: user.id})
      }
      setMessages([...response.data.messages.messages, ...messages])
      setReachedTop(response.data.messages.reachedEnd)
      setLoadingMessages(false)
    }
    catch (err) {
      console.error(err)
      setLoadingMessages(false)
    }
  }

  useEffect(() => {
     
    loadMore(null)    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if(lastMessage!==null) {
      if(lastMessage.senderId === user.id) {
        for(let i = 0; i < pendingMessages.length; i++) {
          if(pendingMessages[i].body === lastMessage.body) {
            setPendingMessages([...pendingMessages.slice(0,i), ...pendingMessages.slice(i+1)])
            break;
          }
        }
      }
    }
    messagesListBottom.current?.scrollIntoView({behavior: 'smooth'});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastMessage]);

  useEffect(() => {
    messagesListBottom.current?.scrollIntoView({behavior: 'smooth'});
  }, [pendingMessages])

  const handleNewMessageChange = (event) => {
    setNewMessage(event.target.value);
  }

  const handleSendMessage = () => {
    if(newMessage !== "") {
      sendMessage(newMessage, party);
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
  if(loadingMessages) {
    return <>Loading</>
  }
  return (
    <div className={classNames({"party-chat": true, "navbar-is-open": openNavbar})}>
      <ol className="messages-list">
        <button className={"load-more-messages button-81"} disabled={reachedTop} onClick={() => loadMore(messages[0])}>Load More</button>
        {messages.map((message, i) => {
          return(<ChatMessage key={i} message={message} prevMessage={i === 0 ? true : messages[i-1]} pendingMessage={false}/>)
        })}
        {pendingMessages.map((message, i) => {
          return <ChatMessage key={i} message={message} prevMessage={i === 0 ? messages[messages.length-1]: pendingMessages[i-1]} pendingMessage={true} />
        })}
        <div ref={messagesListBottom}></div>
      </ol>
      {inParty==="dm" || inParty==="player" ? <><ReactTextareaAutosize
        value={newMessage}
        onChange={handleNewMessageChange}
        onKeyDown={(event) => handleKeyDown(event)}
        placeholder="Write message..."
        className="new-message-input-field" />
        <button onClick={handleSendMessage} className="send-message-button button-46">
          Send
        </button></> : ""}
      
    </div>
  )
}

function ChatMessage({message, prevMessage, pendingMessage}) {
  const newSender = prevMessage===true || prevMessage.senderId !== message.senderId
  const liClassNames = classNames({"message-item": true, "my-message": message.ownedByCurrentUser, "received-message": !message.ownedByCurrentUser, "new-sender" : newSender, "pendingMessage": pendingMessage})
  return (<li
    className={liClassNames}>
      {newSender ?
        <><div className="chat-img-container"><img src={message.user.picture} alt={message.user.username} /></div><div className="chat-user">{message.user.username}</div></>
      : ""}
      <div className="message-body">{message.body}</div>
    </li>)
  }