import { BACKEND_URL } from "../../constants/constants";
import useNotification from "../../hooks/useNotification";
import axios from "axios";
import GetCurrentUser from "../../utils/GetCurrentUser";
import {useState, useEffect} from "react"

export default function PanelButton({ party, inParty, requestedUsers }) {
  const [buttonText, setButtonText] = useState("Loading...");
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [onPress, setOnPress] = useState(() => {});
  const [justRequested, setJustRequested] = useState(false);
  const { sendNotification } = useNotification(null, null);

  const [error, setError] = useState("");

  const getCurrentUser = GetCurrentUser();

  useEffect(() => {
    const haveRequested = async () => {
      try {
        if (requestedUsers === null) {
          return;
        }
        const userIds = requestedUsers.map((item) => {
          return item.objectId;
        });
        const currentUser = await getCurrentUser();
        if (userIds.includes(currentUser.id) || justRequested) {
          setButtonDisabled(false);
          setOnPress(() => cancelRequest);
          setButtonText("Cancel Request");
        } else {
          setButtonText("Request to Join");
          setOnPress(() => requestJoin);
          setButtonDisabled(false);
        }
      } catch (err) {
        setError(err);
        console.error(err);
      }
    };

    if (!inParty && (party.party.status === "Closed" || party.party.full)) {
      setButtonText("Party Closed");
      setButtonDisabled(true);
    } else if (inParty === "player") {
      setButtonText("Leave Party");
      setOnPress(() => leaveParty);
      setButtonDisabled(false);
    } else if (inParty === "dm") {
      setButtonText("Delete Party");
      setOnPress(() => deleteParty);
      setButtonDisabled(false);
    } else {
      haveRequested();
    }
    setJustRequested(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestedUsers]);

  const requestJoin = async () => {
    try {
      setButtonDisabled(true);
      setButtonText("Sending Request");
      const currentUser = await getCurrentUser();
      const response = await axios.post(
        `${BACKEND_URL}user/${party.party.objectId}/join`,
        { userId: currentUser }
      );
      const notification = response.data.notification;
      sendNotification(notification);
      setButtonDisabled(false);
      setOnPress(() => cancelRequest);
      setButtonText("Cancel Request");
    } catch (err) {
      setError(err);
      console.error(err);
    }
  };

  const leaveParty = async () => {
    try {
      setButtonText("Leaving party");
      setButtonDisabled(true);
      const currentUser = await getCurrentUser();
      const response = await axios.post(
        `${BACKEND_URL}user/${party.party.objectId}/leave`,
        { userId: currentUser }
      );
      const notification = response.data.notification;
      sendNotification(notification);
      setButtonText("Successfully left party");
    } catch (err) {
      setError(err);
      console.error(err);
    }
  };

  const cancelRequest = async () => {
    try {
      setButtonText("Cancelling Request");
      setButtonDisabled(true);
      const currentUser = await getCurrentUser();
      const response = await axios.post(
        `${BACKEND_URL}user/${party.party.objectId}/cancel-join`,
        { userId: currentUser }
      );
      const notification = response.data.notification;
      sendNotification(notification);
      setButtonText("Successfully cancelled request");
      setJustRequested(false);
    } catch (err) {
      setError(err);
      console.error(err);
    }
  };

  const deleteParty = async () => {
    try {
      setButtonText("Deleting Party");
      setButtonDisabled(true);
      const currentUser = await getCurrentUser();
      const response = await axios.post(
        `${BACKEND_URL}party/${party.party.objectId}/delete`,
        { dm: currentUser }
      );
      const notifications = response.data.notifications;
      notifications.forEach((item) => sendNotification(item));
      setButtonText("Successfully deleted party");
      setJustRequested(false);
    } catch (err) {
      setError(err);
      console.error(err);
    }
  };

  return (
    <div className="panel-button">
      <button disabled={buttonDisabled} onClick={() => onPress()}>
        {buttonText}
      </button>
      {error !== "" ? (
        <div className="party-page-failed">
          <h1 className="party-page-failed-message">
            {error.response.data
              ? error.response.data.error.message
              : error.message}
          </h1>
          <h2 className="party-page-failed-status-text">{error.statusText}</h2>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}