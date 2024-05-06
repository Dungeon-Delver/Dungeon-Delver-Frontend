import { Link } from "react-router-dom";
import classNames from "classnames";

export default function ChatMessage({ message, prevMessage, pendingMessage }) {
	function padTo2Digits(num) {
		return String(num).padStart(2, "0");
	}
	const messageDate = new Date(message.createdAt);
	var prevMessageDate;
	if (prevMessage) {
		prevMessageDate = new Date(prevMessage.createdAt);
	}
	const dateString =
		messageDate.getHours() > 12
			? messageDate.getHours() -
			  12 +
			  ":" +
			  padTo2Digits(messageDate.getMinutes()) +
			  " pm"
			: messageDate.getHours() +
			  ":" +
			  padTo2Digits(messageDate.getMinutes()) +
			  " am";

	const newDate =
		prevMessage === undefined ||
		prevMessage === true ||
		prevMessageDate.getFullYear() !== messageDate.getFullYear() ||
		prevMessageDate.getMonth() !== messageDate.getMonth() ||
		prevMessageDate.getDate() !== messageDate.getDate();

	const newSender =
		prevMessage === undefined ||
		prevMessage === true ||
		prevMessage.senderId !== message.senderId ||
		newDate;
	const liClassNames = classNames({
		"message-item": true,
		"my-message": message.ownedByCurrentUser,
		"received-message": !message.ownedByCurrentUser,
		"new-sender": newSender,
		"pending-message": pendingMessage,
		"timed-out": message.hasOwnProperty("timedOut"),
	});

	return (
		<>
			{newDate ? (
				<div className="new-date">
					{messageDate.getMonth() +
						1 +
						"/" +
						messageDate.getDate() +
						"/" +
						messageDate.getFullYear()}
				</div>
			) : (
				""
			)}
			<li className={liClassNames}>
				{newSender ? (
					<>
						<Link to={`/user/${message.senderId}`}>
							<div className="chat-img-container">
								<img
									src={message.user.picture}
									alt={message.user.name}
								/>
							</div>
						</Link>
						<div className="chat-user">{message.user.name}</div>
					</>
				) : (
					""
				)}
				<div className="message-body">
					<div className="message-content">{message.body}</div>
					<div className="message-date">{dateString}</div>
				</div>
			</li>
		</>
	);
}
