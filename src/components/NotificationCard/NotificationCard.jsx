import "./NotificationCard.css"

export default function NotificationCard( {notification} ) {
  let message;
  if(notification.type === "remove") {
    message = `You were removed from ${notification.party.name} by ${notification.sourceUser.username}`
  }
  return (
    <div className="notification-card">
      <div className="info">
        <img className="notification-img" src={notification.sourceUser.picture} alt="notification" />
        <span>{message}</span>
      </div>
    </div>
  )
}