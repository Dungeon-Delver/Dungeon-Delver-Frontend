import {useState} from 'react'
import './FindParties.css'
import CategoryContainer from "../CategoryContainer/CategoryContainer"
import axios from 'axios';


import classNames from 'classnames';
import { URL } from '../../constants/constants';
import SearchCard from '../SearchCard/SearchCard.jsx';
import Loader from '../Loader/Loader';
import GetCurrentUser from '../../constants/GetCurrentUser';

export default function FindParties() {
  const [activeExperience, setActiveExperience] = useState("")
  const [activeType, setActiveType] = useState("")
  const [activeGenre, setActiveGenre] = useState("")
  const [activeLevel, setActiveLevel] = useState("");
  const [missingParams, setMissingParams] = useState([])

  const [loadingParty, setLoadingParty] = useState(false);
  const [partyFailed, setPartyFailed] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1)
  const [prevDisabled, setPrevDisabled] = useState(true);
  const [nextDisabled, setNextDisabled] = useState(false);

  const [searchResults, setSearchResults] = useState("");
  const getCurrentUser = GetCurrentUser();

  const categories = [{
      category: "experience level",
      selectors: ["New Players Only", "New Player Friendly", "Experienced Players Only"],
      activeSelector: activeExperience,
      setActiveSelector: setActiveExperience
    }, {
      category: "type of players",
      selectors: ["Serious", "Casual", "Comedy", "Rules-Oriented", "Homebrew-Friendly", "Any Type"],
      activeSelector: activeType,
      setActiveSelector: setActiveType
      
    }, {
      category: "genre",
      selectors: ["Fantasy", "Sci-Fi", "Modern", "Post-Apocalyptic", "Star Wars", "Harry Potter", "Any Genre"],
      activeSelector: activeGenre,
      setActiveSelector: setActiveGenre
    }, {
      category: "party level",
      selectors:["1-4", "5-8", "9-12", "13-16", "17-20", "Any Level"],
      activeSelector: activeLevel,
      setActiveSelector: setActiveLevel
    }
  ]

  const handleSearchParty = async() => {
    const user = await getCurrentUser();
    const JSON_OBJECT = {
      user: user.id,
      searchParameters: {
        experience: activeExperience,
        type: activeType,
        genre: activeGenre,
        level: activeLevel,
      },
    }
    try {
      const data = await axios.post(`${URL}party/search`, JSON_OBJECT);
      setSearchResults(data.data.response?.parties ?? null)
      setLoadingParty(false);
      setNextDisabled(data.data.response.reachedEnd)
      setPrevDisabled(true)
      setPartyFailed(false);
      setPage(1)
    }
    catch (error){
      console.error(error)
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

  const handleNext = async () => {
    const user = await getCurrentUser();
    const JSON_OBJECT = {
      user: user.id,
      searchParameters: {
        experience: activeExperience,
        type: activeType,
        genre: activeGenre,
        level: activeLevel,
      },
      last: searchResults[searchResults.length-1]
    }
    try {
      const data = await axios.post(`${URL}party/search`, JSON_OBJECT);
      setSearchResults(data.data.response?.parties ?? null)
      setLoadingParty(false);
      setPartyFailed(false);
      setPage(page+1)
      setPrevDisabled(false)
      setNextDisabled(data.data.response.reachedEnd)
    }
    catch (error){
      console.error(error)
      setPartyFailed(true);
      setLoadingParty(false)
      setError(error);
    }
  }

  const handlePrevious = async () => {
    const user = await getCurrentUser();
    const JSON_OBJECT = {
      user: user.id,
      searchParameters: {
        experience: activeExperience,
        type: activeType,
        genre: activeGenre,
        level: activeLevel,
      },
      first: searchResults[0]
    }
    try {
      const data = await axios.post(`${URL}party/search`, JSON_OBJECT);
      if(data.data.response!=null) {
        setSearchResults(data.data.response.parties)
        setPrevDisabled(data.data.response.reachedEnd)
        setNextDisabled(false);
        var newPage = page
        if(page > 1) {
          --newPage
        }
        if(newPage > 0 && data.data.response.reachedEnd) {
          newPage = 1
        }
        setPage(newPage)
      }
      else {
        setPage(1)
        setPrevDisabled(true)
      }
      setLoadingParty(false);
      setPartyFailed(false);
    }
    catch (error){
      console.error(error)
      setPartyFailed(true);
      setLoadingParty(false)
      setError(error);
    }
  }

  var bottom;

  if(loadingParty) {
    bottom = <Loader />
  }
  else if(searchResults === "") {
    bottom = <h2 className="before-search">Enter criteria and search!</h2>
  }
  else if(searchResults === null) {
    bottom = <h2 className="no-parties">There are no parties that meet these search criteria</h2>
  }

  else if (partyFailed) {
    bottom = <div className="party-failed"> 
    <h1 className="party-failed-message">{error.response.data ? error.response.data.error.message : error.message}</h1>
    <h2 className="party-failed-status-text">{error.statusText}</h2>
    </div>
  }
  else {
    bottom =
    <>
      <ul className="search-results">
        {searchResults.map((item, i) => {
          return <SearchCard key={i} party={item} />
        })}
    </ul>
    <div className="button-20-container">
      <button disabled={prevDisabled} onClick={handlePrevious} className="previous-button button-20">Previous</button>
      <div className="page-number">
        Page {page}
      </div>
      <button disabled={nextDisabled} onClick={handleNext} className="next-button button-20">Next</button>
    </div>
  </>
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
      </form>
      {bottom}
    </div>
  )
}