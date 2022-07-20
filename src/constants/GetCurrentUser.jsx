import Parse from "./parseInitialize"
import { useSetRecoilState } from 'recoil';
import { currentUser, loggedInState  } from '../recoil/atoms/atoms';

const LOCALHOST_SERVER_URL = "http://localhost:3001/"



export default function GetCurrentUser() {
  const setCurrentUser = useSetRecoilState(currentUser)
  const setLoggedIn = useSetRecoilState(loggedInState)

  return (
    async () => {
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
  )
}