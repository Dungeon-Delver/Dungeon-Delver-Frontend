import axios from 'axios';
import * as React from 'react'
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import Constants from '../../constants/appConstants';
import { currentUser } from '../../recoil/atoms/atoms';
import Loader from '../Loader/Loader';
import "./PartyPage.css"



export default function PartyPage() {
  const params = useParams();

  const [party, setParty] = React.useState(0)
  const [inParty, setInParty] = React.useState(false);
  const [error, setError] = React.useState("")
  const [loadingParty, setLoadingParty] = React.useState(true);
  const URL = Constants().URL;
  const getCurrentUser = Constants().getCurrentUser;
  const user = useRecoilValue(currentUser)

  React.useEffect(() => {
    const checkPermissions = async (result) => {
      await getCurrentUser();
      if(result.dm.objectId===user.id) {
        setInParty(true);
      }
}
    const fetchData = async () => {
      try {
        const response = await axios.get(`${URL}party/${params.partyId}`);
        const result = response.data.party
        setParty(result);
        checkPermissions(result);
      }
      catch (e) {
        console.log(e);
        setParty(null);
        setError(e)
      }
      setLoadingParty(false);
    }
    setLoadingParty(true);
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  

  if(loadingParty) {
    <Loader />
  }

  if(party==null) {
    return <h1>{error.response.data ? error.response.data.error.message : error.message}</h1>
  }
  
  return(
    <div className="party-page">
      <h1>{party.name}</h1>
    </div>
  )
}