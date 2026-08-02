import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { getWateringStatus } from "./YourGrid";
import API_BASE_URL from "../config";

const NotificationContext = createContext(null);

export function useNotifications() {
  return useContext(NotificationContext);
}

// Get today's Plant of the Day name from a deterministic seed
function getDailyPlantName() {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const plants = [
    "Monstera Deliciosa", "Peace Lily", "Snake Plant", "Pothos", "Fiddle Leaf Fig",
    "Spider Plant", "Aloe Vera", "Boston Fern", "ZZ Plant", "Rubber Plant",
    "Bird of Paradise", "Calathea", "Philodendron", "Orchid", "Jade Plant",
    "String of Pearls", "Lavender", "Basil", "Rosemary", "Succulent",
  ];
  return plants[seed % plants.length];
}

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [notifPermission, setNotifPermission] = useState(
    () => (typeof Notification !== "undefined" ? Notification.permission : "default")
  );
  const firedBrowserNotifs = useRef(new Set());

  // ── Request browser notification permission ──────────────────────────────
  const requestPermission = useCallback(async () => {
    if (typeof Notification === "undefined") return;
    const result = await Notification.requestPermission();
    setNotifPermission(result);
    return result;
  }, []);

  // ── Fire a native OS notification ────────────────────────────────────────
  const fireBrowserNotif = useCallback((title, body, tag) => {
    if (notifPermission !== "granted") return;
    if (firedBrowserNotifs.current.has(tag)) return;
    firedBrowserNotifs.current.add(tag);

    if (navigator.serviceWorker?.controller) {
      navigator.serviceWorker.ready.then((reg) => {
        reg.showNotification(title, {
          body,
          icon: "/icons/icon-192.png",
          badge: "/icons/icon-96.png",
          tag,
          vibrate: [200, 100, 200],
        });
      });
    } else {
      new Notification(title, { body, icon: "/icons/icon-192.png", tag });
    }
  }, [notifPermission]);

  // ── Build notifications from user plants ─────────────────────────────────
  const buildNotifications = useCallback(async () => {
    const newNotifs = [];

    // 1. Plant of the Day notification
    const todayKey = new Date().toISOString().split("T")[0];
    newNotifs.push({
      id: `potd_${todayKey}`,
      type: "potd",
      title: "🌿 Plant of the Day",
      body: `Today's featured plant: ${getDailyPlantName()}`,
      plantName: getDailyPlantName(),
      timestamp: new Date().toISOString(),
      read: false,
    });

    // 2. Watering reminders from user plants
    const token = localStorage.getItem("plantio_token");
    if (token) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/user-plants`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          const plants = data.plants || [];

          plants.forEach((plant) => {
            const status = getWateringStatus(plant.lastWatered, plant.wateringFrequency);
            if (status.statusType === "overdue") {
              const notif = {
                id: `water_overdue_${plant.id}`,
                type: "overdue",
                title: `💧 ${plant.title} needs water!`,
                body: status.label.replace(/🔴\s*/, ""),
                plantId: plant.id,
                plantName: plant.title,
                timestamp: new Date().toISOString(),
                read: false,
              };
              newNotifs.push(notif);
              fireBrowserNotif(
                `💧 ${plant.title} needs water!`,
                notif.body,
                `overdue_${plant.id}`
              );
            } else if (status.statusType === "soon") {
              newNotifs.push({
                id: `water_soon_${plant.id}`,
                type: "soon",
                title: `🟡 Water ${plant.title} today`,
                body: "It's watering day — keep your plant happy!",
                plantId: plant.id,
                plantName: plant.title,
                timestamp: new Date().toISOString(),
                read: false,
              });
            }
          });
        }
      } catch {
        // Silently fail — user may be offline or token expired
      }
    }

    setNotifications(newNotifs);
  }, [fireBrowserNotif]);

  // Build on mount
  useEffect(() => {
    buildNotifications();
  }, [buildNotifications]);

  // Rebuild when user logs in/out
  useEffect(() => {
    const handleStorage = () => buildNotifications();
    window.addEventListener("storage", handleStorage);
    window.addEventListener("plantio_auth_change", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("plantio_auth_change", handleStorage);
    };
  }, [buildNotifications]);

  // Rebuild when a plant is watered (so it clears from the badge)
  useEffect(() => {
    const handleWatered = () => buildNotifications();
    window.addEventListener("plantio_plant_watered", handleWatered);
    return () => window.removeEventListener("plantio_plant_watered", handleWatered);
  }, [buildNotifications]);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const dismissNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        notifPermission,
        markAllRead,
        dismissNotification,
        requestPermission,
        refresh: buildNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
