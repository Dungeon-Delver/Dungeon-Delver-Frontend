import classNames from "classnames";
import { Link } from "react-router-dom";

import "./PartyPanelMembersList.css";
import RemoveUserButton from "../RemoveUserButton/RemoveUserButton";

export default function MembersList({ party, players, dm, inParty }) {
	if (dm === null || players === null) {
		return;
	}

	return (
		<ul
			className={classNames({
				"panel-party-members": true,
				"panel-party-members-dm": inParty === "dm",
			})}>
			<h2 className="party-members-heading">Current Members</h2>
			<Link to={`/user/${dm.objectId}`}>
				<li className="dm">
					<div className="dm-picture member-picture">
						<img src={dm.picture} alt={dm.name} />
					</div>
					<div className="dm-name member-name">👑 {dm.name}</div>
				</li>
			</Link>
			{players.map((item, i) => {
				return (
					<li key={i} className="player">
						<Link to={`/user/${item.objectId}`}>
							<div className="player-picture member-picture">
								<img src={item.picture} alt={item.name} />
							</div>
							<div className="player-name member-name">
								{item.name}
							</div>
						</Link>
						{inParty === "dm" ? (
							<RemoveUserButton
								item={item}
								dm={dm}
								party={party}
							/>
						) : (
							""
						)}
					</li>
				);
			})}
		</ul>
	);
}
