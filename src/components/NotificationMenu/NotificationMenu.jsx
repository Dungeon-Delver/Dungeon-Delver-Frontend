import NotificationCard from "../NotificationCard/NotificationCard";

export default function NotificationMenu({unreadNotifications, notifications, handleCloseNavbar}) {
    return (
    <ol className="notifications-menu">
        {unreadNotifications.map((item, i) => {
          return (
            <NotificationCard
              key={i}
              notification={item}
              handleCloseNavbar={handleCloseNavbar}
              unread={true}
            />
          );
        })}
        {notifications.map((item, i) => {
          return (
            <NotificationCard
              key={i}
              notification={item}
              handleCloseNavbar={handleCloseNavbar}
              unread={false}
            />
          );
        })}
      </ol>
    )
}