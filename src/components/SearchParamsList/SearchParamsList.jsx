import "./SearchParamsList.css"

export default function SearchParamsList({party}) {
  console.log('party: ', party);
  return (
    <ul className="search-params-list">
      <li className="search-experience"><span>Experience:</span> {party.searchParameters.experience}</li>
      <li className="search-type"><span>Type:</span> {party.searchParameters.type}</li>
      <li className="search-genre"><span>Genre:</span> {party.searchParameters.genre}</li>
      <li className="search-level"><span>Party Level:</span> {party.searchParameters.level}</li>
    </ul>
  )
}