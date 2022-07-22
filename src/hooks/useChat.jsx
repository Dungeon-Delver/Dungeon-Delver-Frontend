import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";
import { BACKEND_URL } from "../constants/constants";

const NEW_CHAT_MESSAGE_EVENT = "newChatMessage"; // Name of the event
const SOCKET_SERVER_URL = BACKEND_URL

export default function useChat (partyId)  {
  const [messages, setMessages] = useState([]);
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = socketIOClient(SOCKET_SERVER_URL, {query: {partyId}
  })
    socketRef.current.on(NEW_CHAT_MESSAGE_EVENT, (message) => {
      const incomingMessage = {
        ...message,
        ownedByCurrentUse: message.senderID === socketRef.current.id
      };
      setMessages((messages) => [...messages, incomingMessage])
    })
    return () => {
      socketRef.current.disconnect()
    }
  }, [partyId]);

  const sendMessage = (messageBody) => {
    socketRef.current.emit(NEW_CHAT_MESSAGE_EVENT, {
      body: messageBody,
      senderId: socketRef.current.id
    })
  }

  return {messages, sendMessage}
}


