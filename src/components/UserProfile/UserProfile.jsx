import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BACKEND_URL } from "../../constants/constants";
import Loader from "../Loader/Loader";
import NotFound from "../NotFound/NotFound";
import PartyCard from "../PartyCard/PartyCard";
import "./UserProfile.scss";
import { currentUser } from "../../recoil/atoms/atoms";
import { useRecoilValue } from "recoil";

export default function UserProfile({ handleLogout }) {
	const params = useParams();

	const [parties, setParties] = useState(null);
	const [user, setUser] = useState(undefined);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [confirmDeletingAccount, setConfirmDeletingAccount] = useState(false);
	const loggedInUser = useRecoilValue(currentUser);
	const isOwnAccount = params.userId === loggedInUser.objectId;

	useEffect(() => {
		const getProfile = async () => {
			try {
				const res = await axios.get(
					`${BACKEND_URL}user/${params.userId}/profile`
				);
				setUser(res.data.data.user);
				setParties(res.data.data.parties);
				setLoading(false);
			} catch (err) {
				console.error(err);
				setError(err);
				if (err.response.status === 404) {
					setUser("Not Found");
				} else {
					setUser(null);
					setError(err);
				}
				setLoading(false);
			}
		};
		setLoading(true);
		getProfile();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [params]);
	if (loading) {
		return <Loader />;
	}
	if (user === "Not Found") {
		return <NotFound />;
	}

	if (error) {
		return (
			<div className="user-failed">
				<h1 className="user-failed-message">
					{error.response.data
						? error.response.data.error.message
						: error.message}
				</h1>
				<h2 className="user-failed-status-text">{error.statusText}</h2>
			</div>
		);
	}

	if (user === undefined) {
		return <Loader />;
	}

	const userDate = new Date(user.createdAt);
	const dateOptions = { year: "numeric", month: "short", day: "numeric" };

	const deleteAccount = async () => {
		try {
			await axios.post(`${BACKEND_URL}user/${params.userId}/delete`);
			handleLogout();
		} catch (err) {
			console.error(error);
			setError(error);
		}
	};

	const deleteAccountModal = (
		<div className="modal">
			<article className="modal-container">
				<header className="modal-container-header">
					<h1 className="modal-container-title">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							width="24"
							height="24"
							aria-hidden="true">
							<path fill="none" d="M0 0h24v24H0z" />
							<path
								fill="currentColor"
								d="M14 9V4H5v16h6.056c.328.417.724.785 1.18 1.085l1.39.915H3.993A.993.993 0 0 1 3 21.008V2.992C3 2.455 3.449 2 4.002 2h10.995L21 8v1h-7zm-2 2h9v5.949c0 .99-.501 1.916-1.336 2.465L16.5 21.498l-3.164-2.084A2.953 2.953 0 0 1 12 16.95V11zm2 5.949c0 .316.162.614.436.795l2.064 1.36 2.064-1.36a.954.954 0 0 0 .436-.795V13h-5v3.949z"
							/>
						</svg>
						Are you sure you want to delete your account?
					</h1>
					<button
						className="icon-button"
						onClick={() => setConfirmDeletingAccount(false)}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							width="24"
							height="24">
							<path fill="none" d="M0 0h24v24H0z" />
							<path
								fill="currentColor"
								d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"
							/>
						</svg>
					</button>
				</header>
				<section className="modal-container-body rtf">
					<p>This action cannot be undone</p>
				</section>
				<footer className="modal-container-footer">
					<button
						className="button is-ghost"
						onClick={() => setConfirmDeletingAccount(false)}>
						Cancel
					</button>
					<button
						className="button is-primary"
						onClick={deleteAccount}>
						Confirm Account Deletion
					</button>
				</footer>
			</article>
		</div>
	);

	const deleteAccountButton = (
		<div className={"delete-account-button-wrapper"}>
			<button
				className="delete-account-button"
				onClick={() => setConfirmDeletingAccount(true)}>
				<span className="text">Delete Account</span>
				<span className="icon">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24">
						<path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z" />
					</svg>
				</span>
			</button>
		</div>
	);

	return (
		<div className="user-profile">
			{isOwnAccount && deleteAccountButton}
			{isOwnAccount && confirmDeletingAccount && deleteAccountModal}
			<div className="user-data-container">
				<div className="user-data">
					<div className="user-picture-and-name">
						<div className="user-profile-image-container">
							<img src={user.picture} alt={user.name} />
						</div>
						<h1 className="user-profile-name">{user.name}</h1>
					</div>
					<div className="user-profile-date-joined">{`Delving since ${userDate.toLocaleDateString(
						userDate,
						dateOptions
					)}`}</div>
				</div>
			</div>
			{parties.playerParties.length > 0 ||
			parties.dmParties.length > 0 ? (
				<>
					<h2>{`${user.name}'s Public Parties`}</h2>
					<ul className="parties">
						{parties.dmParties.map((item, i) => {
							return (
								<PartyCard
									key={i}
									party={item}
									role={"Dungeon Master"}
								/>
							);
						})}
						{parties.playerParties.map((item, i) => {
							return (
								<PartyCard
									key={i}
									party={item}
									role={"Player"}
								/>
							);
						})}
					</ul>
				</>
			) : (
				<h2 className="no-parties">
					This user is not currently in any public parties
				</h2>
			)}
		</div>
	);
}
