import {useState} from 'react'
import './FindParties.css'
import CategoryContainer from "../CategoryContainer/CategoryContainer"
import axios from 'axios';

import { useNavigate } from 'react-router-dom';

import classNames from 'classnames';
import { URL } from '../../constants/constants';

export default function CreateParty() {
  const [activeExperience, setActiveExperience] = useState("")
  const [activeType, setActiveType] = useState("")
  const [activeGenre, setActiveGenre] = useState("")
  const [activeLevel, setActiveLevel] = useState("");
  const [missingParams, setMissingParams] = useState([])

  const [loadingParty, setLoadingParty] = useState(false);
  const [partyFailed, setPartyFailed] = useState(false);
  const [error, setError] = useState("");

  const [searchResults, setSearchResults] = useState("");

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
    }
  ]

  const handleSearchParty = async() => {
    const JSON_OBJECT = {
      searchParameters: {
        experience: activeExperience,
        type: activeType,
        genre: activeGenre,
        level: activeLevel,
      },
    }
    try {
      const data = await axios.post(`${URL}party/search`, JSON_OBJECT);
      setSearchResults(data.data.parties)
      setLoadingParty(false);
      setPartyFailed(false);
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
    const states = [{value: activeExperience, category: "experience"}, {value: activeType, category: "type"}, {value: activeGenre, category: "genre"}, {value: activeLevel, category: "level"}]
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
    handleSearchParty();
  }

  return (
    <div className="find-parties">
      <form className="find-parties-form">
        <div className="categories">
          {categories.map((item) => (
            <CategoryContainer key={item.category} category={item} />
          ))}
        </div>
        <button className={classNames({"button": true, "button--loading": loadingParty})} onClick={(event) => handleSubmit(event)}>
          <div className="button__text">Find Dungeons</div>
        </button>
        <div className="missing-params">{missingParams}</div>
        {partyFailed ?<div className="party-failed"> 
          <h1 className="party-failed-message">{error.response.data ? error.response.data.error.message : error.message}</h1>
          <h2 className="party-failed-status-text">{error.statusText}</h2>
        </div> :""}
      </form>
    </div>
  )
}