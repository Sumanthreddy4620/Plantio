const PLANT_PLACEHOLDER =
  "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80";

function getWateringStatus(lastWatered, frequencyDays) {
  const last = new Date(lastWatered);
  const today = new Date();
  const daysSince = Math.floor((today - last) / (1000 * 60 * 60 * 24));
  const freq = parseInt(frequencyDays, 10) || 7;

  if (daysSince >= freq) return { label: "💧 Water now!", cls: "due" };
  if (daysSince >= freq - 1) return { label: "💧 Water soon", cls: "soon" };
  return { label: `✅ ${freq - daysSince}d left`, cls: "ok" };
}

export default function YourGrid({ entry, onDelete, onWater }) {
  const imgSrc = entry.imgUrl || PLANT_PLACEHOLDER;
  const status = getWateringStatus(entry.lastWatered, entry.wateringFrequency);

  return (
    <div className="your-entry">
      <div className="main-image-container">
        <img
          className="main-image"
          src={imgSrc}
          alt={entry.title}
          onError={(e) => { e.target.src = PLANT_PLACEHOLDER; }}
        />
      </div>

      <h3 className="main-name">{entry.title}</h3>
      {entry.text && <p className="main-name-info">{entry.text}</p>}

      {/* Delete button (appears on hover via CSS) */}
      <button
        className="your-delete-btn"
        onClick={onDelete}
        title="Remove plant"
      >
        🗑
      </button>

      {/* Watering badge */}
      <div
        className={`watering-badge ${status.cls}`}
        onClick={onWater}
        title="Click to mark as watered today"
        style={{ cursor: "pointer" }}
      >
        {status.label}
      </div>
    </div>
  );
}