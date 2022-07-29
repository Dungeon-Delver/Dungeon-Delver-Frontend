import { useEffect, useRef } from "react";
import { useRecoilValue } from "recoil";
import { currentUser } from "../recoil/atoms/atoms";
import socketIOClient from "socket.io-client";
import { SOCKET_SERVER_URL } from "../constants/constants";

const NEW_NOTIFICATION_EVENT = "newNotification"; // Name of the event


export default function useNotification (notifications, setNotifications, deleteNotif)  {
  const socketRef = useRef();
  const curUser = useRecoilValue(currentUser)
  const userId = curUser.id


  useEffect(() => {
    socketRef.current = socketIOClient(SOCKET_SERVER_URL, {query: {userId}})
    const notificationEvent = async() => {
      socketRef.current.on(NEW_NOTIFICATION_EVENT, async (notification) => {
        console.log('notification received: ', notification);
        if(notification.notification.user.objectId === userId) {
          if(notification.notification.hasOwnProperty("cancel")) {
            deleteNotif(notification)
          }
          else {
            setNotifications([notification.notification, ...notifications])
          }
        }
          
      })
  }
  if(notifications !== null && setNotifications !== null) {
    notificationEvent()

    return () => {
      socketRef.current.disconnect()
    }
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const sendNotification = async (notification) => {
    const room = notification.user.objectId
    const socket = socketIOClient(SOCKET_SERVER_URL, {query: {room}})
    socket.emit(NEW_NOTIFICATION_EVENT, {
      notification: notification
    })
    const receiveSocket = socketIOClient(SOCKET_SERVER_URL, {query: {room}})
    receiveSocket.on(NEW_NOTIFICATION_EVENT, async (receivedNotification) => {
      if(notification.objectId === receivedNotification.objectId) {
        receiveSocket.disconnect();
        socket.disconnect();
      }
    })
    
  }

  return {sendNotification}
}