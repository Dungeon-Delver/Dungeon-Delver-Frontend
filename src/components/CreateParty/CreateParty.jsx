import * as React from 'react'
import './CreateParty.css'
import CategoryContainer from "../CategoryContainer/CategoryContainer"
import axios from 'axios';

import { useRecoilValue } from 'recoil';
import { backendUrl, userId } from '../../recoil/atoms/atoms';

export default function CreateParty() {
  const [partyName, setPartyName] = React.useState("");
  const [activeExperience, setActiveExperience] = React.useState("")
  const [activeType, setActiveType] = React.useState("")
  const [activeGenre, setActiveGenre] = React.useState("")
  const [activeLevel, setActiveLevel] = React.useState("");
  const [activeMode, setActiveMode] = React.useState("");
  const [missingParams, setMissingParams] = React.useState([])

  const [loadingParty, setLoadingParty] = React.useState(false);

  const URL = useRecoilValue(backendUrl)

   const id = useRecoilValue(userId);

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
      experience: activeExperience,
      type: activeType,
      genre: activeGenre,
      level: activeLevel,
      mode: activeMode
    }
    try {
      await axios.post(URL, JSON_OBJECT);
    }
    catch (error){
      console.error(error);
    }
  }

  const handleSubmit = () => {
    const missingParamsTmp=[];
    const states = [{value: partyName, category: "party name"}, {value: activeExperience, category: "experience"}, {value: activeType, category: "type"}, {value: activeGenre, category: "genre"}, {value: activeLevel, category: "level"}, {value: activeMode, category: "privacy mode"}]
    states.forEach((item) => {
      if(item.value==='') {
        missingParamsTmp.push(<div key={item.category}className="missing-param">Please pick something for {item.category}</div>)
      }
    })
    setMissingParams(missingParamsTmp);
    if(missingParamsTmp.length>0) {
      return;
    }
    setLoadingParty(true);
    handleCreateParty();
  }

  return (
    <div className="create-party">
      <div className="party-name">
        <input className="party-name-input" name="name" placeholder="Dungeoneers" value={partyName} onChange={(event) => setPartyName(event.target.value)}></input>
      </div>
      <div className="categories">
        {categories.map((item) => (
          <CategoryContainer key={item.category} category={item} />
        ))}
      </div>
      <button className={loadingParty ? "button button--loading" : "button"} onClick={handleSubmit}>
        <div className="button__text">Create Dungeon</div>
      </button>
      <div className="missing-params">{missingParams}</div>
    </div>
  )
}