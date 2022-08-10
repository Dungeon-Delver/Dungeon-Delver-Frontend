import { useState } from "react";
import "./PartyPanel.css";
import MembersList from "../PartyPanelMembersList/PartyPanelMembersList";
import RequestedUsers from "../RequestedUsers/RequestedUsers";
import CategoriesDisplay from "../CategoriesDisplay/CategoriesDisplay.jsx";
import { useRecoilValue } from "recoil";
import { navbarOpen } from "../../recoil/atoms/atoms";
import classNames from "classnames";
import PanelButton from "../PartyPanelButton/PartyPanelButton";


export default function PartyPanel({ party, inParty, fetchData }) {
  const openNavbar = useRecoilValue(navbarOpen);
  const [panelOpen, setOpenPanel] = useState(false);

  const togglePanel = () => {
    setOpenPanel(!panelOpen);
  };
  return (
    <div
      className={classNames({
        "party-panel": true,
        responsive: panelOpen,
        "navbar-is-open": openNavbar,
      })}
    >
      <div>
        <h1 className="party-title">{party.party.name}</h1>
      </div>
      {inParty !== 0 || party.party.status === "Public" ? (
        <MembersList
          party={party}
          dm={party.members.dm}
          players={party.members.players}
          inParty={inParty}
          visible={inParty || party.party.status !== "Closed"}
          maxDisplay={-1}
        />
      ) : (
        ""
      )}
      {inParty === "dm" ? (
        <RequestedUsers
          party={party}
          requestedUsers={party.requestedUsers}
          fetchData={fetchData}
        />
      ) : (
        ""
      )}
      <CategoriesDisplay
        party={party}
        inParty={inParty}
        fetchData={fetchData}
      />
      <PanelButton
        party={party}
        inParty={inParty}
        requestedUsers={party.requestedUsers}
      />
      <div className="party-panel-icon" onClick={togglePanel}>
        👤
      </div>
    </div>
  );
}
