import "./NotificationCenter.css"
import NotificationBell from "../../images/notification-bell.svg"
import NotificationCard from "../NotificationCard/NotificationCard"
import useNotification from "../../hooks/useNotification"
import { useEffect, useState } from "react"
import { useRecoilValue } from "recoil"
import { currentUser } from "../../recoil/atoms/atoms"
import axios from "axios"
import { BACKEND_URL } from "../../constants/constants"

export default function NotificationCenter() {
  const [unreadNotifications, setUnreadNotifications] = useState([])
  const [notifications, setNotifications] = useState([])
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  useNotification(unreadNotifications, setUnreadNotifications)

  const curUser = useRecoilValue(currentUser)

  const handleCloseNavbar = () => {
    setNotificationsOpen(false)
    setNotifications([...unreadNotifications, ...notifications])
    setUnreadNotifications([])
    try {
      axios.post(`${BACKEND_URL}user/read-notifications`, {notifications: unreadNotifications})
    }
    catch (err) {
      console.error(err)
    }
  }
  
  useEffect(() => {
    const getNotifications = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}user/${curUser.id}/notifications`)
        setNotifications(response.data.notifications.readNotifications)
        setUnreadNotifications(response.data.notifications.unreadNotifications)
      }
      catch (err) {
        console.error(err)
      }
    }
    getNotifications()
  }, [curUser.id])

  return (
    <div className="notification-center">
      <div className="notification-bell">
        <img src={NotificationBell} className="iconImg" alt="notification bell" onClick={() => {!notificationsOpen ? setNotificationsOpen(true) : handleCloseNavbar()}}/>
        {unreadNotifications.length > 0 ? <div className="counter">{unreadNotifications.length}</div> : ""}
      </div>
      {notificationsOpen ? 
            <ol className="notifications-menu">
              {unreadNotifications.map((item, i) => {
                return <NotificationCard key={i} notification={item} handleCloseNavbar={handleCloseNavbar} unread={true}/>
              })}
              {notifications.map((item, i) => {
                return <NotificationCard key={i} notification={item} handleCloseNavbar={handleCloseNavbar} unread={false}/>
              })}
            </ol>
        : ""}
    </div>
  )
}