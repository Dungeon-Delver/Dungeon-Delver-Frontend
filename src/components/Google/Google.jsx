import * as React from "react";
import { GoogleLogin } from "@react-oauth/google";
import Parse from "../../utils/parseInitialize";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

import Keys from "../../keys.json";

import GetCurrentUser from "../../utils/GetCurrentUser";

import { useSetRecoilState } from "recoil";
import { isLoggingInState, loggedInState } from "../../recoil/atoms/atoms";

export default function Google() {
	const setLoggedIn = useSetRecoilState(loggedInState);
	const setIsLoading = useSetRecoilState(isLoggingInState);
	const getCurrentUser = GetCurrentUser();

	const componentClicked = () => {
		setIsLoading(true);
	};

	const handleGoogleLogin = async (response) => {
		// Check if response has an error
		const token = jwtDecode(response.credential);
		if (response.error !== undefined) {
			console.error(`Error: ${response.error}`);
		} else {
			try {
				const userEmail = token.email;
				const userPicture = token.picture;
				const userName = token.email;
				const name = token.name;
				try {
					await Parse.User.logIn(userName, token.sub);
				} catch {
					const userToLogin = new Parse.User();
					// Set username and email to match google email
					userToLogin.set("username", userEmail);
					userToLogin.set("email", userEmail);
					userToLogin.set("picture", userPicture);
					userToLogin.set("password", token.sub);
					userToLogin.set("name", name);
					await userToLogin.save();
					await Parse.User.logIn(userName, token.sub);
				}
				try {
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
				console.log(
					"Error gathering Google user info, please try again!"
				);
				console.error(`Error! ${error.message}`);
				return false;
			}
		}
	};

	return (
		<div style={{ width: "400px", margin: "auto" }}>
			<GoogleOAuthProvider clientId={Keys.clientId}>
				<GoogleLogin
					onSuccess={(credentialResponse) => {
						handleGoogleLogin(credentialResponse);
					}}
					onError={() => {
						console.log("Login Failed");
					}}
					onClick={componentClicked}
					size={"medium"}
					shape={"pill"}
					logo_alignment={"left"}
					width={"400"}
				/>
			</GoogleOAuthProvider>
		</div>
	);
}
