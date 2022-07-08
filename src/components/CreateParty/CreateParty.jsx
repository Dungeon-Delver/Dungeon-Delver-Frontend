import * as React from 'react'
import './CreateParty.css'
import CategoryContainer from "../CategoryContainer/CategoryContainer"

export default function CreateParty() {
  const [partyName, setPartyName] = React.useState("");

  const [activeExperience, setActiveExperience] = React.useState("")
  const [activeType, setActiveType] = React.useState("")
  const [activeGenre, setActiveGenre] = React.useState("")
  const [activeLevel, setActiveLevel] = React.useState("");

  const categories = [{
      category: "Experience Level",
      selectors: ["New Players Only", "New Player Friendly", "Experienced Players Only"],
      activeSelector: activeExperience,
      setActiveSelector: setActiveExperience
    }, {
      category:"Type",
      selectors: ["Serious", "Casual", "Comedy", "Rules-Oriented", "Homebrew-Friendly"],
      activeSelector: activeType,
      setActiveSelector: setActiveType
      
    }, {
      category: "Genre",
      selectors: ["Fantasy", "Sci-Fi", "Modern", "Post-Apocalyptic", "Star Wars", "Harry Potter"],
      activeSelector: activeGenre,
      setActiveSelector: setActiveGenre
    }, {
      category:"Party Level",
      selectors:["1-4", "5-8", "9-12", "13-16", "17-20", "Any"],
      activeSelector: activeLevel,
      setActiveSelector: setActiveLevel
    }]

  const handleSubmit = () => {
    console.log(partyName);
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
        <input type="submit" value="Create Dungeon" onClick={handleSubmit}/>
    </div>
  )
}