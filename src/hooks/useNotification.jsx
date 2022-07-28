import { useEffect, useRef } from "react";
import { useRecoilValue } from "recoil";
import { currentUser } from "../recoil/atoms/atoms";
import socketIOClient from "socket.io-client";
import { CHAT_SERVER_URL } from "../constants/constants";

const NEW_CHAT_MESSAGE_EVENT = "newNotification"; // Name of the event


export default function useNotification (notifications, setNotifications)  {
  const socketRef = useRef();
  const curUser = useRecoilValue(currentUser)
  const userId = curUser.objectId


  useEffect(() => {
    socketRef.current = socketIOClient(CHAT_SERVER_URL, {query: {userId}
  })
    const notificationEvent = async() => {
      socketRef.current.on(NEW_CHAT_MESSAGE_EVENT, async (notification) => {
      setNotifications([notification, ...notifications])
      })
  }
    notificationEvent()

    return () => {
      socketRef.current.disconnect()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const sendNotification = async (notification) => {
    socketRef.current.emit(NEW_CHAT_MESSAGE_EVENT, {
      notification: notification
    })
  }

  return {sendNotification}
}