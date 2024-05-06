import axios from "axios";
import { useState } from "react";
import { BACKEND_URL } from "../../constants/constants";
import GetCurrentUser from "../../utils/GetCurrentUser";
import useNotification from "../../hooks/useNotification";

export default function RequestedUserCard({ user, party, fetchData }) {
	const [acceptButtonText, setAcceptButtonText] = useState("Accept Request");
	const [rejectButtonText, setRejectButtonText] = useState("Reject Request");
	const [buttonsDisabled, setButtonsDisabled] = useState(false);
	const { sendNotification } = useNotification(null, null);
	const getCurrentUser = GetCurrentUser();

	const acceptUser = async () => {
		setAcceptButtonText("Accepting...");
		const currentUser = await getCurrentUser();
		setButtonsDisabled(true);
		const response = await axios.post(
			`${BACKEND_URL}party/${party.objectId}/accept/${user.objectId}`,
			{ dm: currentUser }
		);
		const notification = response.data.notification;
		sendNotification(notification);
		fetchData();
	};
	const rejectUser = async () => {
		setRejectButtonText("Rejecting...");
		setButtonsDisabled(true);
		const currentUser = await getCurrentUser();
		const response = await axios.post(
			`${BACKEND_URL}party/${party.objectId}/reject/${user.objectId}`,
			{ dm: currentUser }
		);
		const notification = response.data.notification;
		sendNotification(notification);
		fetchData();
	};
	return (
		<li className="requested-user-card">
			<div className="user-image-container">
				<img
					className="user-image"
					src={user.picture}
					alt={user.name}
				/>
			</div>
			<div className="requested-user-name">{user.name}</div>
			<button
				className="accept-user-button"
				disabled={buttonsDisabled}
				onClick={acceptUser}>
				{acceptButtonText}
			</button>
			<button
				className="reject-user-button"
				disabled={buttonsDisabled}
				onClick={rejectUser}>
				{rejectButtonText}
			</button>
		</li>
	);
}
