import axios from 'axios';
import * as React from 'react'
import { useParams } from 'react-router-dom';
import Constants from '../../constants/appConstants';
import Loader from '../Loader/Loader';
import PartySidebar from "../PartySidebar/PartySidebar.jsx"
import PartyChat from "../PartyChat/PartyChat"
import PartyPanel from '../PartyPanel/PartyPanel';
import "./PartyPage.css"
import { currentUser } from '../../recoil/atoms/atoms';
import { useRecoilValue } from 'recoil';



export default function PartyPage() {
  const params = useParams();

  const [party, setParty] = React.useState(0)
  const [inParty, setInParty] = React.useState(false);
  const [error, setError] = React.useState("")
  const [loadingParty, setLoadingParty] = React.useState(true);
  const URL = Constants().URL
  const user = useRecoilValue(currentUser)

  React.useEffect(() => {

    const setup = async () => {
      try {
        await fetchData()
        setLoadingParty(false)
      }
      catch (err) {
        console.log(error)
      }
      
    }
    setup()
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkPermissions = (members) => {
    var inPartyVal = 0;
    if(user.id === members.dm.objectId) {
      inPartyVal = "dm"
    }
    members.players.forEach((item) => {
      if(item.objectId === user.id) {
        inPartyVal = "player"
      }
    })
    setInParty(inPartyVal)
  }

  const fetchData = async () => {
    try {
      const response = await axios.get(`${URL}party/${params.partyId}`);
      const result = response.data.party
      setParty(result)
      checkPermissions(result.members)
      return
    }
    catch (e) {
      console.log(e);
      setParty(null);
      setError(e)
    }
  }

  if(loadingParty) {
    return(
      <Loader />
    )
  }

  if(party===null) {
    return <h1>{error.response.data ? error.response.data.error.message : error.message}</h1>
  }
  return(
    <div className="party-page">
      <PartySidebar party={party} inParty={inParty} />
      <PartyChat party={party} inParty={inParty} />
      <PartyPanel party={party} inParty={inParty} fetchData={fetchData} />
    </div>
  )
}