import axios from 'axios';
import * as React from 'react'
import { useParams } from 'react-router-dom';
import Constants from '../../constants/appConstants';
import "./PartyPage.css"



export default function PartyPage() {
  const params = useParams();

  const [party, setParty] = React.useState(0)
  const URL = Constants().URL;

  React.useEffect( () => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${URL}${[params.partyId]}`);
        const result = response.data.product;
        setParty(result);
      }
      catch (e) {
        console.log(e);
        setParty(null);
      }
    }
    fetchData();
  }, [params.partyId, URL]);

  return(
    <div className="party-page">
      <h1></h1>
    </div>
  )
}