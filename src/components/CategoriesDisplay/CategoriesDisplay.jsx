import classNames from 'classnames'
import * as React from 'react'
import EditParty from '../EditParty/EditParty';
import "./CategoriesDisplay.css"

export default function CategoriesDisplay({party, inParty}) {

  const [editingParty, setEditingParty] = React.useState(false);

  const parameters = [["Experience", party.party.searchParameters.experience], ["Genre", party.party.searchParameters.genre], ["Level", party.party.searchParameters.level], ["Type", party.party.searchParameters.type
], ["Status", party.party.status]]


  const modifyParams = () => {
    setEditingParty(!editingParty)
  }
  return(
    <div className="categories-display">
      <h1 className="search-params-heading">Search Parameters</h1>
      {inParty==="dm" ? <div onClick={() => modifyParams()}>⚙️</div> : ""}
      {parameters.map(item => {
        return (<div key={item} className={classNames({"category": true, "dm": inParty==="dm"})}>
          {item[0]}: {item[1]}
          </div>)
      })}
      {editingParty ? <EditParty party={party} activeSelectors={parameters}/> : ""}
    </div>
  )
}