import { useState, useRef, useEffect } from "react";
import { useNotifications } from "./NotificationProvider";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);
  const bellRef = useRef(null);
  const { notifications, unreadCount, markAllRead, dismissNotification, notifPermission, requestPermission } =
    useNotifications();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target) &&
        bellRef.current &&
        !bellRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleBellClick() {
    setOpen((prev) => !prev);
    if (!open && unreadCount > 0) {
      // Mark all read after a short delay so badge update is visible
      setTimeout(markAllRead, 800);
    }
  }

  function getNotifStyle(type) {
    if (type === "overdue") return "notif-item notif-overdue";
    if (type === "soon") return "notif-item notif-soon";
    if (type === "potd") return "notif-item notif-potd";
    return "notif-item";
  }

  const overdueCount = notifications.filter((n) => n.type === "overdue").length;
  const soonCount = notifications.filter((n) => n.type === "soon").length;

  return (
    <div className="notif-bell-wrapper">
      {/* Bell button */}
      <button
        ref={bellRef}
        className={`notif-bell-btn ${open ? "notif-bell-active" : ""} ${overdueCount > 0 ? "notif-bell-urgent" : ""}`}
        onClick={handleBellClick}
        title="Notifications"
        aria-label={`Notifications — ${unreadCount} unread`}
        id="notification-bell-btn"
      >
        <span className="notif-bell-icon">
          {overdueCount > 0 ? "🔔" : "🔕"}
        </span>
        {unreadCount > 0 && (
          <span className="notif-badge" aria-live="polite">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="notif-panel" ref={panelRef} role="dialog" aria-label="Notifications panel">
          {/* Header */}
          <div className="notif-panel-header">
            <div className="notif-panel-title-row">
              <h3 className="notif-panel-title">🔔 Notifications</h3>
              {notifications.length > 0 && (
                <button className="notif-clear-all-btn" onClick={() => notifications.forEach(n => dismissNotification(n.id))}>
                  Clear all
                </button>
              )}
            </div>

            {/* Summary pills */}
            {(overdueCount > 0 || soonCount > 0) && (
              <div className="notif-summary-pills">
                {overdueCount > 0 && (
                  <span className="notif-pill notif-pill-red">
                    💧 {overdueCount} overdue
                  </span>
                )}
                {soonCount > 0 && (
                  <span className="notif-pill notif-pill-yellow">
                    🟡 {soonCount} due today
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Enable browser notifications prompt */}
          {notifPermission !== "granted" && notifPermission !== "denied" && (
            <div className="notif-enable-row">
              <div className="notif-enable-text">
                <span style={{ fontSize: "1.1rem" }}>📲</span>
                <span>Get OS alerts for overdue plants</span>
              </div>
              <button className="notif-enable-btn" onClick={requestPermission}>
                Enable
              </button>
            </div>
          )}

          {/* Notification items */}
          <div className="notif-list">
            {notifications.length === 0 ? (
              <div className="notif-empty">
                <span style={{ fontSize: "2rem" }}>🌿</span>
                <p>All good! No alerts right now.</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div key={notif.id} className={getNotifStyle(notif.type)}>
                  <div className="notif-item-content">
                    <p className="notif-item-title">{notif.title}</p>
                    <p className="notif-item-body">{notif.body}</p>
                  </div>
                  <button
                    className="notif-dismiss-btn"
                    onClick={() => dismissNotification(notif.id)}
                    title="Dismiss"
                    aria-label={`Dismiss notification: ${notif.title}`}
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="notif-panel-footer">
            <span className="notif-footer-tip">
              {notifPermission === "granted"
                ? "✅ OS notifications enabled"
                : notifPermission === "denied"
                ? "🚫 OS notifications blocked"
                : "💡 Enable OS alerts above"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
