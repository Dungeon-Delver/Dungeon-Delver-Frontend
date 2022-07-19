import axios from "axios";
import classNames from "classnames";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import Constants from "../../constants/appConstants";
import { navbarOpen } from "../../recoil/atoms/atoms";
import CategoryContainer from "../CategoryContainer/CategoryContainer";
import "./EditParty.css"

export default function EditParty({party, activeSelectors, fetchData, modifyParams}) {

  const getCurrentUser = Constants().getCurrentUser

  const [partyName, setPartyName] = useState(party.party.name);
  const [activeExperience, setActiveExperience] = useState(activeSelectors[0][1])
  const [activeType, setActiveType] = useState(activeSelectors[3][1])
  const [activeGenre, setActiveGenre] = useState(activeSelectors[1][1])
  const [activeLevel, setActiveLevel] = useState(activeSelectors[2][1]);
  const [activeMode, setActiveMode] = useState(activeSelectors[4][1]);
  const [missingParams, setMissingParams] = useState([])

  const [loadingParty, setLoadingParty] = useState(false);
  const [error, setError] = useState("");

  const openNavbar = useRecoilValue(navbarOpen)

  const handleSaveParty = async() => {
    const user = await getCurrentUser();
    const JSON_OBJECT = {
      name: partyName,
      dm: user.id,
      searchParameters: {
        experience: activeExperience,
        type: activeType,
        genre: activeGenre,
        level: activeLevel,
      },
      mode: activeMode
    }
    try {
      await axios.post(`${URL}party/${party.party.objectId}/modify`, JSON_OBJECT);
      setLoadingParty(false)
      fetchData();
      setError("")
      modifyParams(false)
    }
    catch (error){
      console.error(error);
      setLoadingParty(false)
      setError(error);
    }
  }

  const URL = Constants().URL;
    
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
    handleSaveParty();
  }

  return (
    <form className={classNames({"edit-party": true, "navbar-is-open": openNavbar})}>
       <div className="close-modify-params" onClick={modifyParams}>✖</div>
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
        <div className="button__text">Save Changes</div>
      </button>
      <div className="missing-params">{missingParams}</div>
      {error!=="" ?<div className="party-failed"> 
        <h3 className="party-failed-message">{error.response.data ? error.response.data.error.message : error.message}</h3>
        <h4 className="party-failed-status-text">{error.statusText}</h4>
      </div> :""}
    </form>
  )

}

