import axios from "axios";
import { useEffect, useRef } from "react";
import { useRecoilValue } from "recoil";
import socketIOClient from "socket.io-client";
import { BACKEND_URL, CHAT_SERVER_URL } from "../constants/constants";
import GetCurrentUser from "../constants/GetCurrentUser";
import { currentUser } from "../recoil/atoms/atoms";

const NEW_CHAT_MESSAGE_EVENT = "newChatMessage"; // Name of the event

export default function useChat (partyId, messages, setMessages, setLastMessage)  {
  const socketRef = useRef();

  const getCurrentUser = GetCurrentUser();

  const curUser = useRecoilValue(currentUser)


  useEffect(() => {
    socketRef.current = socketIOClient(CHAT_SERVER_URL, {query: {partyId}
  })
    const chatMessageEvent = async() => {
      socketRef.current.on(NEW_CHAT_MESSAGE_EVENT, async (message) => {
       let userSender
      try {
        const response = await axios.get(`${BACKEND_URL}user/${message.senderId}`)
        userSender = response.data.user
      }
      catch (err) {
        return;
      }
      const incomingMessage = {
        ...message,
        user: userSender,
        ownedByCurrentUser: message.senderID === curUser.id
      };
      setMessages((messages) => [...messages, incomingMessage])
      setLastMessage(message)
      })
  }
    chatMessageEvent()

    return () => {
      socketRef.current.disconnect()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partyId, curUser.id]);

  const sendMessage = async (messageBody, party) => {
    const currentUser = await getCurrentUser();
    socketRef.current.emit(NEW_CHAT_MESSAGE_EVENT, {
      body: messageBody,
      senderId: currentUser.id,
      partyId: party.party.objectId
    })
  }

  return {messages, sendMessage}
}



