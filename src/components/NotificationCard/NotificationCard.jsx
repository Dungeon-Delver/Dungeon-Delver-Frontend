import classNames from "classnames";
import { Link } from "react-router-dom";
import "./NotificationCard.css"

export default function NotificationCard( {notification, handleCloseNavbar, unread} ) {
  let message;
  if(notification.type === "remove") {
    message = `You were removed from ${notification.party.name} by ${notification.sourceUser.username}`
  }
  return (
    <Link to={`/party/${notification.party.objectId}`}>
      <div className={classNames({"notification-card": true, unread: unread, read: !unread})} onClick={() => handleCloseNavbar(false)}>
        <span className="dot"></span>
        <img className="notification-img" src={notification.sourceUser.picture} alt="notification" />
        <span>{message}</span>
      </div>
    </Link>
  )
}