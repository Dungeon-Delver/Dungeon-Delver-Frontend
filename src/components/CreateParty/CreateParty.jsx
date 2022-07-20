import {useState} from 'react'
import './CreateParty.css'
import CategoryContainer from "../CategoryContainer/CategoryContainer"
import axios from 'axios';

import { useNavigate } from 'react-router-dom';

import { useRecoilValue } from 'recoil';
import { currentUser } from '../../recoil/atoms/atoms';
import classNames from 'classnames';
import { URL } from '../../constants/constants';

export default function CreateParty() {
  const [partyName, setPartyName] = useState("");
  const [activeExperience, setActiveExperience] = useState("")
  const [activeType, setActiveType] = useState("")
  const [activeGenre, setActiveGenre] = useState("")
  const [activeLevel, setActiveLevel] = useState("");
  const [activeMode, setActiveMode] = useState("");
  const [missingParams, setMissingParams] = useState([])

  const [loadingParty, setLoadingParty] = useState(false);
  const [partyFailed, setPartyFailed] = useState(false);
  const [error, setError] = useState("");

  const id = useRecoilValue(currentUser);
  const navigate = useNavigate();

  const categories = [{
      category: "experience level",
      selectors: ["New Players Only", "New Player Friendly", "Experienced Players Only"],
      activeSelector: activeExperience,
      setActiveSelector: setActiveExperience
    }, {
      category: "type of players",
      selectors: ["Serious", "Casual", "Comedy", "Rules-Oriented", "Homebrew-Friendly"],
      activeSelector: activeType,
      setActiveSelector: setActiveType
      
    }, {
      category: "genre",
      selectors: ["Fantasy", "Sci-Fi", "Modern", "Post-Apocalyptic", "Star Wars", "Harry Potter"],
      activeSelector: activeGenre,
      setActiveSelector: setActiveGenre
    }, {
      category: "party level",
      selectors:["1-4", "5-8", "9-12", "13-16", "17-20", "Any"],
      activeSelector: activeLevel,
      setActiveSelector: setActiveLevel
    }, {
      category: "privacy mode",
      selectors:["Closed", "Private", "Public"],
      activeSelector: activeMode,
      setActiveSelector: setActiveMode
    }]

  const handleCreateParty = async() => {
    const JSON_OBJECT = {
      name: partyName,
      dm: id,
      searchParameters: {
        experience: activeExperience,
        type: activeType,
        genre: activeGenre,
        level: activeLevel,
      },
      mode: activeMode
    }
    try {
      const data = await axios.post(`${URL}party/create-party`, JSON_OBJECT);
      const partyId = data.data.newParty
      setLoadingParty(false);
      setPartyFailed(false);
      navigate(`/party/${partyId}`, {replace : false})
    }
    catch (error){
      console.error(error);
      setPartyFailed(true);
      setLoadingParty(false)
      setError(error);
    }
  }

  const validateForm = () => {
    const missingParamsTmp=[];
    const states = [{value: partyName, category: "party name"}, {value: activeExperience, category: "experience"}, {value: activeType, category: "type"}, {value: activeGenre, category: "genre"}, {value: activeLevel, category: "level"}, {value: activeMode, category: "privacy mode"}]
    states.forEach((item) => {
      if(item.value==='') {
        missingParamsTmp.push(<div key={item.category}className="missing-param">Please pick something for {item.category}</div>)
      }
    })
    setMissingParams(missingParamsTmp);
    if(missingParamsTmp.length>0) {
      return false;
    }
    return true;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    if(!validateForm()) {
      return;
    }
    setLoadingParty(true);
    handleCreateParty();
  }

  return (
    <form className="create-party">
      <div className="party-name form__group field">
        <input className="party-name-input form__field" id="name" name="Party Name" placeholder="Dungeoneers" value={partyName} onChange={(event) => setPartyName(event.target.value)}></input>
        <label htmlFor="name" className="form__label">Party Name</label>
      </div>
      <div className="categories">
        {categories.map((item) => (
          <CategoryContainer key={item.category} category={item} />
        ))}
      </div>
      <button className={classNames({"button": true, "button--loading": loadingParty})} onClick={(event) => handleSubmit(event)}>
        <div className="button__text">Create Dungeon</div>
      </button>
      <div className="missing-params">{missingParams}</div>
      {partyFailed ?<div className="party-failed"> 
        <h1 className="party-failed-message">{error.response.data ? error.response.data.error.message : error.message}</h1>
        <h2 className="party-failed-status-text">{error.statusText}</h2>
      </div> :""}
    </form>
  )
}