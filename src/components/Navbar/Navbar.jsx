import { Link } from "react-router-dom";

import "./Navbar.css";
import Logo from "../Logo/Logo";
import classNames from "classnames";
import NotificationCenter from "../NotificationCenter/NotificationCenter.jsx";
import { useRecoilState, useRecoilValue } from "recoil";
import { currentUser, navbarOpen } from "../../recoil/atoms/atoms";
import { getWidth } from "../../constants/ScreenDimensions";
import { useEffect } from "react";

export default function Navbar({ handleLogout }) {
	const [openNavbar, setOpenNavbar] = useRecoilState(navbarOpen);
	const user = useRecoilValue(currentUser);
	const toggleNavbar = () => {
		setOpenNavbar(!openNavbar);
	};

	useEffect(() => {
		window.addEventListener("resize", onResize);
		return function cleanupListener() {
			window.removeEventListener("resize", onResize);
		};
	});

	const onResize = () => {
		if (getWidth() > 600 && openNavbar) {
			setOpenNavbar(false);
		}
	};

	return (
		<div className={classNames({ navbar: true, responsive: openNavbar })}>
			<Logo id="logo" />
			<div className="nav-button-container">
				<Link to={`/create-party`}>
					<button className="create-party-button nav-button">
						Create Party
					</button>
				</Link>
			</div>
			<div className="nav-button-container">
				<Link to={`/find-parties`}>
					<button className="find-parties-button nav-button">
						Find Parties
					</button>
				</Link>
			</div>
			<div className="nav-button-container">
				<Link to={`/parties`}>
					<button className="my-parties-button nav-button">
						My Parties
					</button>
				</Link>
			</div>
			<div className="nav-button-container">
				<Link to={`/privacy-policy`}>
					<button className="privacy-policy-button nav-button">
						Privacy Policy
					</button>
				</Link>
			</div>
			<NotificationCenter />
			<Link className={"my-profile-icon"} to={`/user/${user.objectId}`}>
				<div className="my-profile-picture-container">
					<img src={user.picture} alt={user.username} />
				</div>
			</Link>
			<div className="nav-button-container logout-button-container">
				<button
					className="logout-button nav-button"
					onClick={() => {
						handleLogout();
					}}>
					Logout
				</button>
			</div>
			<div className="icon" onClick={toggleNavbar}>
				☰
			</div>
		</div>
	);
}
