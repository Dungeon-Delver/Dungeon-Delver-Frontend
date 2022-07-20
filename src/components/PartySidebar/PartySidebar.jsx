import axios from 'axios'
import {useState, useEffect} from 'react'
import './PartySidebar.css'
import GetCurrentUser from '../../constants/GetCurrentUser'
import Loader from '../Loader/Loader'
import PartySidebarCard from "../PartySidebarCard/PartySidebarCard"
import classNames from 'classnames'
import { useRecoilValue } from 'recoil'
import { navbarOpen } from '../../recoil/atoms/atoms'
import { BACKEND_URL } from '../../constants/constants'

export default function PartySidebar({party}) {
  const [parties, setParties] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const getCurrentUser = GetCurrentUser();
  const openNavbar = useRecoilValue(navbarOpen)

  const [openSidebar, setOpenSidebar] = useState(false);
  const toggleSidebar = () => {
    setOpenSidebar(!openSidebar)
  }

  useEffect( () => {
    const getParties = async () => {
      try{
        const user = await getCurrentUser();
        const res = await axios.get(`${BACKEND_URL}user/${user.id}/parties`)
        setParties(res.data.parties)
        setLoading(false)
      }
      catch (err) {
        console.error(err)
        setError(err);
        setLoading(false)
      }
    }
    setLoading(true)
    getParties()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  if(loading) {
    return (
      <Loader />
    )
  }

  if(error) {
    return (
      <div className="my-parties">
        <div className="error">
          <h1 className="error-message">{error.response.data ? error.response.data.error.message : error.message}</h1>
        </div>
      </div>
    )
  }
  if(parties===null) {
    return(<Loader />)
  }
  return (
    <div className={classNames({"party-sidebar": true, "responsive": openSidebar, "navbar-is-open": openNavbar})}>
        {parties!=null ? 
         <ul className="parties-list">
          {parties.dmParties.slice(0).reverse().map((item, i) => {
            return <PartySidebarCard key={i} currentParty={party} party={item} role={"Dungeon Master"}/>
          })}
          {parties.playerParties.slice(0).reverse().map((item, i) => {
            return <PartySidebarCard key={i} currentParty={party} party={item} role={"Player"}/>
          })}
        </ul>
        : ""}
        <div className="sidebar-icon" onClick={toggleSidebar}>☰</div>
    </div>
  )
}