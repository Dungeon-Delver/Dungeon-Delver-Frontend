import {useState} from 'react'
import './FindParties.css'
import CategoryContainer from "../CategoryContainer/CategoryContainer"
import axios from 'axios';


import classNames from 'classnames';
import { BACKEND_URL } from '../../constants/constants';
import SearchCard from '../SearchCard/SearchCard.jsx';
import Loader from '../Loader/Loader';
import { useRecoilValue } from 'recoil';
import { currentUser } from '../../recoil/atoms/atoms';

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
  const [prevDisabled, setPrevDisabled] = useState(0);
  const [nextDisabled, setNextDisabled] = useState(0);
  const [partyName, setPartyName] = useState("")
  const [searchMode, setSearchMode] = useState(null)
  const [prev, setPrev] = useState([])
  const [next, setNext] = useState([])
  const [queuePrev, setQueuePrev] = useState(false)
  const [queueNext, setQueueNext] = useState(false)
  const [fetchedNext, setFetchedNext] = useState(false)
  const [fetchedPrev, setFetchedPrev] = useState(false)
  const user = useRecoilValue(currentUser)

  const [searchResults, setSearchResults] = useState("");

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
    const JSON_OBJECT = {
      user: user.id,
      searchParameters: {
        experience: activeExperience,
      },
    }
    setQueueNext(false)
    setQueuePrev(false)

    if(activeType !== "Any Type") {
      JSON_OBJECT.searchParameters.type = activeType
    }
    if(activeGenre !== "Any Genre") {
      JSON_OBJECT.searchParameters.genre = activeGenre
    }
    if(activeLevel !== "Any Level") {
      JSON_OBJECT.searchParameters.level = activeLevel
    }
    try {
      const data = await axios.post(`${BACKEND_URL}party/search`, JSON_OBJECT);
      if(data.data.response.parties.length > 0) {
        setSearchResults(data.data.response.parties)
        if(!data.data.response.reachedEnd) { 
          handlePrefetch(null, data.data.response.parties[data.data.response.parties.length-1])
          setFetchedPrev(true)
          setFetchedNext(false)
        }
        else {
          setNextDisabled(0)
        }
      }
      else {
        setSearchResults(null)
      }
      setLoadingParty(false);
      setPrevDisabled(0)
      setPartyFailed(false);
      setPage(1)
      setSearchMode("params")
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

  const handleSearchPartyByName = async() => {
    try {
      const data = await axios.post(`${BACKEND_URL}party/search`, {user: user.id, name: partyName});
      if(data.data.response.parties.length > 0) {
        setSearchResults(data.data.response.parties)
        setNextDisabled(data.data.response.reachedEnd)
        handlePrefetch(null, data.data.response.parties[data.data.response.parties.length-1])
      }
      else {
        setSearchResults(null)
      }
      setLoadingParty(false);
      setPrevDisabled(true)
      setPartyFailed(false);
      setPage(1)
      setSearchMode("name")
    }
    catch (error){
      console.error(error)
      setPartyFailed(true);
      setLoadingParty(false)
      setError(error);
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    if(!validateForm()) {
      return;
    }
    setLoadingParty(true);
    handleSearchParty();
  }

  const handleSubmitByName = (event) => {
    event.preventDefault();
    setLoadingParty(true);
    handleSearchPartyByName();
  }

  const handleNext = async () => {
    setQueueNext(false)
    setQueuePrev(false)
    if(searchMode === "params") {
      if(next.length > 0 && fetchedNext && fetchedPrev) {
        setSearchResults(next)
        if(nextDisabled > 1) {
          handlePrefetch(next[0], next[next.length-1])
        }
        else {
          handlePrefetch(next[0], null)
          setNextDisabled(0)
        }
        setNext([])
        setPrev([])
        setPage(page+1)
      }
      setPrevDisabled(2)
    }
    else if (searchMode === "name") {
      try {
        const data = await axios.post(`${BACKEND_URL}party/search`, {user: user.id, name: partyName, last: searchResults[searchResults.length-1]});
        if(data.data.response.parties.length > 0) {
          setSearchResults(data.data.response.parties)
          setPage(page+1)
          setPrevDisabled(prevDisabled+1)
          setNextDisabled(data.data.response.reachedEnd)
        }
        else {
          setNextDisabled(true)
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
  }

  const handlePrevious = async () => {
    setQueueNext(false)
    setQueuePrev(false)
    if(searchMode === "params") {
      if(prev.length > 0  && fetchedPrev && fetchedNext) {
        setSearchResults(prev)
        if(prevDisabled > 1) {
          handlePrefetch(prev[0], prev[prev.length-1])
        }
        else {
          handlePrefetch(null, prev[prev.length-1])
          setFetchedNext(true)
          setPrevDisabled(0)
        }
        setNext([])
        setPrev([])
        let newPage = page
        if(page > 1) {
          --newPage
        }
        if(newPage > 0 && prevDisabled === 1) {
          newPage = 1
        }
        setPage(newPage)
      }
      else {
        handlePrefetch(searchResults[0], null)
      }
      setNextDisabled(2)
    }
    else if (searchMode==="name") {
      try {
        const data = await axios.post(`${BACKEND_URL}party/search`, {user: user.id, name: partyName, first: searchResults[0]});
        if(data.data.response.parties.length > 0) {
          setSearchResults(data.data.response.parties)
          setPrevDisabled(data.data.response.reachedEnd)
          setNextDisabled(false);
          let newPage = page
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
    
  }

  const handlePrefetch = async(first, last) => {
    if(first !== null) { //prefetch previous
      setFetchedPrev(false)
      const JSON_OBJECT = {
        user: user.id,
        searchParameters: {
          experience: activeExperience,
        },
        first: first
      }
      if(activeType !== "Any Type") {
        JSON_OBJECT.searchParameters.type = activeType
      }
      if(activeGenre !== "Any Genre") {
        JSON_OBJECT.searchParameters.genre = activeGenre
      }
      if(activeLevel !== "Any Level") {
        JSON_OBJECT.searchParameters.level = activeLevel
      }
      try {
        const data = await axios.post(`${BACKEND_URL}party/search`, JSON_OBJECT);
        if(data.data.response.parties.length > 0) {
          setPrev(data.data.response.parties)
          if(data.data.response.reachedEnd) {
            setPrevDisabled(1)
          }
          else {
            setPrevDisabled(2)
          }
        }
        else {
          setPrevDisabled(0)
        }
        setFetchedPrev(true)
      }
      catch (error){
        console.error(error)
        setPartyFailed(true);
        setLoadingParty(false)
        setError(error);
      }
    }
    if(last !== null) { //prefetch next
      setFetchedNext(false)
      const JSON_OBJECT = {
        user: user.id,
        searchParameters: {
          experience: activeExperience,
        },
        last: last
      }
      if(activeType !== "Any Type") {
        JSON_OBJECT.searchParameters.type = activeType
      }
      if(activeGenre !== "Any Genre") {
        JSON_OBJECT.searchParameters.genre = activeGenre
      }
      if(activeLevel !== "Any Level") {
        JSON_OBJECT.searchParameters.level = activeLevel
      }
      try {
        const data = await axios.post(`${BACKEND_URL}party/search`, JSON_OBJECT);
        if(data.data.response.parties.length > 0) {
          setNext(data.data.response.parties)
          if(data.data.response.reachedEnd) {
            setNextDisabled(1)
          }
          else {
            setNextDisabled(2)
          }
        }
        else {
          setNextDisabled(0)
        }
        setFetchedNext(true)
      }
      catch (error){
        console.error(error)
        setPartyFailed(true);
        setLoadingParty(false)
        setError(error);
      }
    }
  }

  if(!queuePrev && queueNext && fetchedNext && fetchedPrev) {
    handleNext()
    setQueueNext(false)
  }
  else if (queuePrev && !queueNext && fetchedNext && fetchedPrev){
    handlePrevious()
    setQueuePrev(false)
  }

  let bottom;

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
      <button disabled={prevDisabled === 0} onClick={fetchedPrev  && fetchedNext ? () => handlePrevious() : () => {setQueuePrev(true); setQueueNext(false)}} className="previous-button button-20">Previous</button>
      <div className="page-number">
        Page {page}
      </div>
      <button disabled={nextDisabled === 0} onClick={fetchedNext && fetchedPrev ? () => handleNext() : () => {setQueueNext(true); setQueuePrev(false)}} className="next-button button-20">Next</button>
    </div>
  </>
  }

  return (
    <div className="find-parties">
      <form className="find-parties-form">
        <div className="categories">
          <h2>Search by category...</h2>
          {categories.map((item) => (
            <CategoryContainer key={item.category} category={item} />
          ))}
        </div>
        <button className={classNames({"button": true, "button--loading": loadingParty})} onClick={(event) => handleSubmit(event)}>
          <div className="button__text">Find Dungeons</div>
        </button>
        <div className="missing-params">{missingParams}</div>
      </form>
      <form className="find-parties-by-name-form">
        <h2>... or by party name!</h2>
        <div className="party-name form__group field">
          <input className="party-name-input form__field" id="name" name="Party Name" placeholder="Dungeoneers" value={partyName} onChange={(event) => setPartyName(event.target.value)}></input>
          <label htmlFor="name" className="form__label">Party Name</label>
        </div>
        <button className={classNames({"button": true, "button--loading": loadingParty})} onClick={(event) => handleSubmitByName(event)}>
          <div className="button__text">Find Dungeons</div>
        </button>
      </form>
      {bottom}
    </div>
  )
}