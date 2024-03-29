import * as React from "react";
import "./Facebook.css";
import FacebookLogin from "react-facebook-login"; //External library
import Keys from "../../keys.json";
import Parse from "../../utils/parseInitialize";

import GetCurrentUser from "../../utils/GetCurrentUser";

import { useSetRecoilState } from "recoil";
import { isLoggingInState, loggedInState } from "../../recoil/atoms/atoms";
import { useNavigate } from "react-router";

export default function FacebookOAuth() {
	const setLoggedIn = useSetRecoilState(loggedInState);
	const setIsLoading = useSetRecoilState(isLoggingInState);

	const componentClicked = () => {
		setIsLoading(true);
	};
	const navigate = useNavigate();

	const getCurrentUser = GetCurrentUser();

	const handleFacebookLogin = async (response) => {
		// Check if response has an error
		if (!response.hasOwnProperty("userData")) {
			console.error("No User Data");
		}

		response = response.userData;
		if (response.error !== undefined) {
			console.error(`Error: ${response.error}`);
		} else {
			try {
				// Gather Facebook user info
				const userId = response.id;
				const userEmail = response.email;
				const userAccessToken = response.accessToken;
				// Try to login on Parse using linkWith and these credentials
				// Create a new Parse.User object
				const userToLogin = new Parse.User();
				// Set username and email to match facebook profile email
				userToLogin.set("username", response.name);
				userToLogin.set("email", userEmail);
				userToLogin.set("picture", response.picture.data.url);
				try {
					await userToLogin.linkWith("facebook", {
						authData: { id: userId, access_token: userAccessToken },
					});
					userToLogin.set("picture", response.picture.data.url);
					await userToLogin.save();
					// logIn returns the corresponding ParseUser object
					const user = await getCurrentUser();
					localStorage.setItem("user", JSON.stringify(user));
					if (!user.enabled) {
						console.error("disabled user");
						setLoggedIn("disabled");
					} else {
						setLoggedIn(true);
					}
				} catch (error) {
					// Error can be caused by wrong parameters or lack of Internet connection
					console.error(`Error! ${error.message}`);
				}
			} catch (error) {
				console.error(
					"Error gathering Facebook user info, please try again!",
					error
				);
			}
		}
	};

	const responseFacebook = async (response) => {
		try {
			await handleFacebookLogin({ userData: response });
			setIsLoading(false);
		} catch (err) {
			console.error(err);
			setIsLoading(false);
		}
	};

	return (
		<div className="FacebookLogin">
			{
				<>
					<FacebookLogin
						appId={Keys.appId}
						autoLoad={false}
						fields="name,email,picture"
						onClick={componentClicked}
						callback={responseFacebook}
					/>
					<div></div>
					<button
						onClick={() => {
							navigate(`/privacy-policy`);
							window.location.reload();
						}}
						className="privacy-policy-button nav-button"
						style={{
							justifySelf: "center",
							marginTop: "1rem",
						}}>
						Privacy Policy
					</button>
				</>
			}
		</div>
	);
}
