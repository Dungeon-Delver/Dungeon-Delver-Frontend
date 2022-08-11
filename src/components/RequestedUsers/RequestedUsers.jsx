import "./RequestedUsers.css";
import RequestedUserCard from "../RequestedUserCard/RequestedUserCard";

export default function RequestedUsers({ requestedUsers, party, fetchData }) {
  if (requestedUsers === null) {
    return;
  }
  return (
    <ul className="requested-users">
      <h3 className="requested-users-title">Join Requests</h3>
      {requestedUsers.map((item, i) => {
        return (
          <RequestedUserCard
            party={party.party}
            fetchData={fetchData}
            key={i}
            user={item}
          />
        );
      })}
    </ul>
  );
}
