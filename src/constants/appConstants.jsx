import Parse from "./parseInitialize"
import { useSetRecoilState } from 'recoil';
import { currentUser, loggedInState  } from '../recoil/atoms/atoms';

const LOCALHOST_SERVER_URL = "http://localhost:3001/"



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