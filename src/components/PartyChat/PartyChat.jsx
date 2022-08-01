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
  const [timedOutMessage, setTimedOutMessage] = useState(null)
  const pendingMessagesRef = useRef(pendingMessages)
  pendingMessagesRef.current = pendingMessages

  const onTimeout = (messageId) => {
    const timer = setTimeout(() => {
      pendingMessagesRef.current.forEach((item) => {
        if(item.messageId === messageId) {
          setTimedOutMessage(item.messageId);
        }
      })
    }, 10000)
    return() => clearTimeout(timer)
  }

  const {sendMessage} = useChat(partyId, setMessages, setLastMessage, pendingMessages, setPendingMessages, onTimeout)
  const [newMessageId, setNewMessageId] = useState(0)

  const messagesListBottom = useRef(null);

  const loadMore = async (firstMessage) => {
    setLoadingMessages(true)
    try {
      let response
      if(firstMessage!=null) {
        response = await axios.post(`${BACKEND_URL}party/${partyId}/messages/`, {firstMessage: firstMessage, userId: user.id})
        setMessages([...response.data.messages.messages, ...messages])
      }
      else {
        response = await axios.post(`${BACKEND_URL}party/${partyId}/messages/`, {userId: user.id})
        setMessages(response.data.messages.messages)
      }
      setReachedTop(response.data.messages.reachedEnd)
      setLoadingMessages(false)
    }
    catch (err) {
      console.error(err)
      setLoadingMessages(false)
    }
  }

  useEffect(() => {
    setPendingMessages([])
    setLastMessage(null)
    loadMore(null)
    
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partyId])

  useEffect(() => {
    if(lastMessage!==null) {
      if(lastMessage.senderId === user.id) {
        for(let i = 0; i < pendingMessages.length; i++) {
          if(pendingMessages[i].messageId === lastMessage.messageId) {
            pendingMessages[i].clearTimeout()
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

  useEffect(() => {
    if(timedOutMessage != null) {
      pendingMessages.forEach((item, i)=> {
        if(item.messageId === timedOutMessage) {
          const newItem = Object.assign({}, item)
          newItem.timedOut = true;
          setPendingMessages([...pendingMessages.slice(0,i), newItem, ...pendingMessages.slice(i+1)])
        }
      })
      setTimedOutMessage(null)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timedOutMessage])

  const handleNewMessageChange = (event) => {
    setNewMessage(event.target.value);
  }

  const handleSendMessage = async () => {
    if(newMessage !== "") {
      try {
        const response = await axios.get(`${BACKEND_URL}user/${user.id}/in/party/${partyId}`)
        if(!response.data.inParty) {
          window.location.reload();
        }
        else {
          sendMessage(newMessage, party, newMessageId);
          setNewMessageId(newMessageId+1)
          setNewMessage("");
        }
      }
      catch (err){
        console.error(err)
      }
     
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
  function padTo2Digits(num) {
    return String(num).padStart(2, '0');
  }
  const messageDate = new Date(message.createdAt)
  var prevMessageDate
  if(prevMessage) {
    prevMessageDate = new Date(prevMessage.createdAt)

  }
  const dateString = messageDate.getHours() > 12 ? messageDate.getHours()-12 + ':' + padTo2Digits(messageDate.getMinutes()) + ' pm' : messageDate.getHours() + ':' + padTo2Digits(messageDate.getMinutes()) + ' am'

  const newSender = prevMessage===undefined || prevMessage===true || prevMessage.senderId !== message.senderId
  const newDate = prevMessage===undefined || prevMessage===true || (prevMessageDate.getFullYear() !== messageDate.getFullYear() || prevMessageDate.getMonth() !== messageDate.getMonth() || prevMessageDate.getDate() !== messageDate.getDate())
  const liClassNames = classNames({"message-item": true, "my-message": message.ownedByCurrentUser, "received-message": !message.ownedByCurrentUser, "new-sender" : newSender, "pending-message": pendingMessage, "timed-out": message.hasOwnProperty("timedOut")})

  return (
    <>
      {newDate ?
        <div className="new-date">{(messageDate.getMonth()+1) + '/' + messageDate.getDate() + '/' + messageDate.getFullYear()}</div>
      : ""}
      <li
      className={liClassNames}>
        {newSender ?
          <><div className="chat-img-container"><img src={message.user.picture} alt={message.user.username} /></div><div className="chat-user">{message.user.username}</div></>
        : ""}
        <div className="message-body">
          <div className="message-content">{message.body}</div>
          <div className="message-date">{dateString}</div>
        </div>
      </li>
    </>)
  }