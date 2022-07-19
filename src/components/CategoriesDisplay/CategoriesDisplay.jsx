import classNames from 'classnames'
import * as React from 'react'
import "./CategoriesDisplay.css"

export default function CategoriesDisplay({party, inParty}) {
  const parameters = [["Experience", party.party.searchParameters.experience], ["Genre", party.party.searchParameters.genre], ["Level", party.party.searchParameters.level], ["Type", party.party.searchParameters.type
]]

  const modifyParams = () => {
    console.log("hi")
  }
  return(
    <div className="categories-display">
      <h1 className="search-params-heading">Search Parameters</h1>
      {parameters.map(item => {
        return (<div key={item} className={classNames({"category": true, "dm": inParty==="dm"})} onClick={inParty==="dm" ? () => modifyParams(item): () => {}}>
          {item[0]}: {item[1]}
          </div>)
      })}
    </div>
  )
}