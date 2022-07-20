import classNames from 'classnames'
import * as React from 'react'
import EditParty from '../EditParty/EditParty';
import "./CategoriesDisplay.css"

export default function CategoriesDisplay({party, inParty, fetchData}) {

  const [editingParty, setEditingParty] = React.useState(false);

  const parameters = [["Experience", party.party.searchParameters.experience], ["Type", party.party.searchParameters.type
], ["Genre", party.party.searchParameters.genre], ["Level", party.party.searchParameters.level], ["Status", party.party.status]]


  const modifyParams = () => {
    setEditingParty(!editingParty)
  }
  return(
    <div className="categories-display">
      <h2 className="search-params-heading">Search Parameters</h2>
      {inParty==="dm" ? <div className="open-modify-party" onClick={() => modifyParams()}>⚙️</div> : ""}
      <div className="categories-list">
        {parameters.map(item => {
          return (<div key={item} className={classNames({"category": true})}>
            {item[0]}: {item[1]}
            </div>)
        })}
      </div>
      {editingParty ? <EditParty party={party} activeSelectors={parameters} fetchData={fetchData} modifyParams={modifyParams}/> : ""}
    </div>
  )
}