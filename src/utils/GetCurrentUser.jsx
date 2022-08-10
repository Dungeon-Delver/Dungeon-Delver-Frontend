import Parse from "./parseInitialize";
import { useSetRecoilState } from "recoil";
import { currentUser, loggedInState } from "../recoil/atoms/atoms";

export default function GetCurrentUser() {
  const setCurrentUser = useSetRecoilState(currentUser);
  const setLoggedIn = useSetRecoilState(loggedInState);

  return async () => {
    const currentUser = Parse.User.current();
    if (currentUser == null) {
      setLoggedIn(false);
    } else {
      if (currentUser.get("enabled")) {
        setLoggedIn(true);
      }
      const userJSON = currentUser.toJSON();
      userJSON.id = userJSON.objectId;
      setCurrentUser(userJSON);
      return userJSON;
    }
  };
}
