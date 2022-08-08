import axios from "axios";
import { useEffect, useRef } from "react";
import { useRecoilValue } from "recoil";
import socketIOClient from "socket.io-client";
import { BACKEND_URL, SOCKET_SERVER_URL } from "../constants/constants";
import GetCurrentUser from "../constants/GetCurrentUser";
import { currentUser } from "../recoil/atoms/atoms";

const NEW_CHAT_MESSAGE_EVENT = "newChatMessage"; // Name of the event

export default function useChat(
  roomId,
  setMessages,
  setLastMessage,
  pendingMessages,
  setPendingMessages,
  onTimeout
) {
  const socketRef = useRef();

  const getCurrentUser = GetCurrentUser();

  const curUser = useRecoilValue(currentUser);

  useEffect(() => {
    socketRef.current = socketIOClient(SOCKET_SERVER_URL, {
      query: { roomId },
    });

    const chatMessageEvent = async () => {
      socketRef.current.on(NEW_CHAT_MESSAGE_EVENT, async (message) => {
        let userSender;
        try {
          const response = await axios.get(
            `${BACKEND_URL}user/${message.senderId}`
          );
          userSender = response.data.user;
        } catch (err) {
          return;
        }
        const incomingMessage = {
          ...message,
          user: userSender,
          ownedByCurrentUser: message.senderId === curUser.id,
        };
        setMessages((messages) => [...messages, incomingMessage]);
        setLastMessage(message);
      });
    };
    chatMessageEvent();

    return () => {
      socketRef.current.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, curUser.id]);

  const sendMessage = async (messageBody, party, messageId) => {
    const currentUser = await getCurrentUser();
    const currentDate = new Date();
    const clearTimeout = onTimeout(messageId);
    setPendingMessages([
      ...pendingMessages,
      {
        body: messageBody,
        senderId: currentUser.id,
        user: { username: currentUser.username, picture: currentUser.picture },
        messageId: messageId,
        createdAt: currentDate.toString(),
        clearTimeout: clearTimeout,
      },
    ]);

    socketRef.current.emit(NEW_CHAT_MESSAGE_EVENT, {
      body: messageBody,
      senderId: currentUser.id,
      partyId: party.party.objectId,
      messageId: messageId,
    });
  };

  return { sendMessage };
}
