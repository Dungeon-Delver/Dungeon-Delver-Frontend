import Parse from 'parse/dist/parse.min.js';
import { useSetRecoilState } from 'recoil';
import Keys from "../keys.json"
import { currentUser, loggedInState  } from '../recoil/atoms/atoms';

const LOCALHOST_SERVER_URL = "http://localhost:3001/"

Parse.initialize(Keys.parse.appId, Keys.parse.javascriptKey)
Parse.serverURL = 'https://parseapi.back4app.com';

export default function Constants() {
  const setCurrentUser = useSetRecoilState(currentUser)
  const setLoggedIn = useSetRecoilState(loggedInState)

  return {
    URL: LOCALHOST_SERVER_URL,
    getCurrentUser: async () => {
      const currentUser = Parse.User.current()
      setCurrentUser(currentUser)
      if(currentUser == null) {
        setLoggedIn(false)
      }
      else {
        if(currentUser.get("enabled")){
          setLoggedIn(true)
        }
        return currentUser;
      }
    }
  }
}