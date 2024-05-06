import { useState } from "react";
import { Link } from "react-router-dom";
import "./PartyCardMembersList.css";

export default function MembersList({ visible, players, dm }) {
	const [hovering, setHovering] = useState(false);
	if (!visible) {
		return;
	}

	if (dm === null || players === null) {
		return;
	}

	return (
		<ul
			className="party-card-members"
			onMouseEnter={() => setHovering(true)}
			onMouseLeave={() => setHovering(false)}>
			<li className="dm">
				<Link to={`/user/${dm.objectId}`}>
					<div className="dm-name member-name">👑 {dm.name}</div>
				</Link>
			</li>
			{players.map((item, i) => {
				if (hovering)
					return (
						<li key={i} className="player">
							<Link to={`/user/${item.objectId}`}>
								<div className="player-name member-name">
									{item.name}
								</div>
							</Link>
						</li>
					);
				else {
					return "";
				}
			})}
		</ul>
	);
}
