import "./NotificationCenter.css";
import NotificationBell from "../../images/notification-bell.svg";
import useNotification from "../../hooks/useNotification";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { currentUser } from "../../recoil/atoms/atoms";
import axios from "axios";
import { BACKEND_URL } from "../../constants/constants";
import classNames from "classnames";
import NotificationMenu from "../NotificationMenu/NotificationMenu";

export default function NotificationCenter() {
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [firstNotif, setFirstNotif] = useState("");
  const [lastNotif, setLastNotif] = useState("");
  const [prevDisabled, setPrevDisabled] = useState(true);
  const [nextDisabled, setNextDisabled] = useState(false);

  const deleteNotif = (notification) => {};

  useNotification(unreadNotifications, setUnreadNotifications, deleteNotif);

  const curUser = useRecoilValue(currentUser);

  const handleCloseNavbar = () => {
    setNotificationsOpen(false);
    setNotifications([...unreadNotifications, ...notifications]);
    setUnreadNotifications([]);
    try {
      axios.post(`${BACKEND_URL}user/read-notifications`, {
        notifications: unreadNotifications,
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const getNotifications = async () => {
      try {
        const response = await axios.post(
          `${BACKEND_URL}user/${curUser.id}/notifications`,
          {}
        );
        setNotifications(response.data.notifications.readNotifications);
        setUnreadNotifications(response.data.notifications.unreadNotifications);
        setFirstNotif(
          response.data.notifications.unreadNotifications.length > 0
            ? response.data.notifications.unreadNotifications[0]
            : response.data.notifications.readNotifications[0]
        );
        setLastNotif(
          response.data.notifications.readNotifications.length > 0
            ? response.data.notifications.readNotifications[
                response.data.notifications.readNotifications.length - 1
              ]
            : response.data.notifications.unreadNotifications[
                response.data.notifications.unreadNotifications.length - 1
              ]
        );
        setNextDisabled(response.data.notifications.reachedEnd);
      } catch (err) {
        console.error(err);
      }
    };
    getNotifications();
  }, [curUser.id]);

  const getNextNotifications = async () => {
    try {
      axios.post(`${BACKEND_URL}user/read-notifications`, {
        notifications: unreadNotifications,
      });
    } catch (err) {
      console.error(err);
    }
    try {
      const response = await axios.post(
        `${BACKEND_URL}user/${curUser.id}/notifications`,
        { last: lastNotif }
      );
      setNotifications(response.data.notifications.readNotifications);
      setUnreadNotifications(response.data.notifications.unreadNotifications);
      setFirstNotif(
        response.data.notifications.unreadNotifications.length > 0
          ? response.data.notifications.unreadNotifications[0]
          : response.data.notifications.readNotifications[0]
      );
      setLastNotif(
        response.data.notifications.readNotifications.length > 0
          ? response.data.notifications.readNotifications[
              response.data.notifications.readNotifications.length - 1
            ]
          : response.data.notifications.unreadNotifications[
              response.data.notifications.unreadNotifications.length - 1
            ]
      );
      setNextDisabled(response.data.notifications.reachedEnd);
      setPrevDisabled(false);
    } catch (err) {
      console.error(err);
    }
  };

  const getPrevNotifications = async () => {
    try {
      axios.post(`${BACKEND_URL}user/read-notifications`, {
        notifications: unreadNotifications,
      });
    } catch (err) {
      console.error(err);
    }
    try {
      const response = await axios.post(
        `${BACKEND_URL}user/${curUser.id}/notifications`,
        { first: firstNotif }
      );
      setNotifications(response.data.notifications.readNotifications);
      setUnreadNotifications(response.data.notifications.unreadNotifications);
      setFirstNotif(
        response.data.notifications.unreadNotifications.length > 0
          ? response.data.notifications.unreadNotifications[0]
          : response.data.notifications.readNotifications[0]
      );
      setLastNotif(
        response.data.notifications.readNotifications.length > 0
          ? response.data.notifications.readNotifications[
              response.data.notifications.readNotifications.length - 1
            ]
          : response.data.notifications.unreadNotifications[
              response.data.notifications.unreadNotifications.length - 1
            ]
      );
      setNextDisabled(false);
      setPrevDisabled(response.data.notifications.reachedEnd);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="notification-center">
      <div className="notification-bell">
        <img
          src={NotificationBell}
          className="iconImg"
          alt="notification bell"
          onClick={() => {
            !notificationsOpen
              ? setNotificationsOpen(true)
              : handleCloseNavbar();
          }}
        />
        {unreadNotifications.length > 0 ? (
          <div className="counter">{unreadNotifications.length}</div>
        ) : (
          ""
        )}
      </div>
      {notificationsOpen ? (
        <div className="notifications-popup">
          <NotificationMenu unreadNotifications={unreadNotifications} notifications={notifications} handleCloseNavbar={handleCloseNavbar}/>
          <div className="arrow-wrapper">
            <div
              className={classNames({
                "arrow arrow--left": true,
                disabled: prevDisabled,
              })}
              onClick={() => {
                if (!prevDisabled) {
                  getPrevNotifications();
                }
              }}
            >
              <span>Prev</span>
            </div>
            <div
              className={classNames({
                "arrow arrow--right": true,
                disabled: nextDisabled,
              })}
              onClick={() => {
                if (!nextDisabled) {
                  getNextNotifications();
                }
              }}
            >
              <span>Next</span>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
