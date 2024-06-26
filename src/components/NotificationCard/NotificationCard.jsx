import classNames from "classnames";
import { Link } from "react-router-dom";
import "./NotificationCard.css";

export default function NotificationCard({
	notification,
	handleCloseNavbar,
	unread,
}) {
	let message;
	if (notification.type === "remove") {
		message = `You were removed from ${notification.party.name} by ${notification.sourceUser.name}`;
	} else if (notification.type === "joinRequest") {
		message = `${notification.sourceUser.name} has requested to join ${notification.party.name}`;
	} else if (notification.type === "leave") {
		message = `${notification.sourceUser.name} has left ${notification.party.name}`;
	} else if (notification.type === "accept") {
		message = `${notification.sourceUser.name} has accepted your request to join ${notification.party.name}`;
	} else if (notification.type === "reject") {
		message = `You have been rejected from ${notification.party.name}`;
	} else if (notification.type === "delete") {
		message = `${notification.sourceUser.name} has deleted ${notification.party.name}`;
	}
	return (
		<Link to={`/party/${notification.party.objectId}`}>
			<div
				className={classNames({
					"notification-card": true,
					unread: unread,
					read: !unread,
				})}
				onClick={() => handleCloseNavbar(false)}>
				<span className="dot"></span>
				<img
					className="notification-img"
					src={notification.sourceUser.picture}
					alt="notification"
				/>
				<span>{message}</span>
			</div>
		</Link>
	);
}
