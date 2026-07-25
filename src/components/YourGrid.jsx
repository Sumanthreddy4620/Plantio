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
        <button
          className="your-delete-btn"
          onClick={onDelete}
          title="Delete plant"
          aria-label="Delete plant"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
        </button>
      </div>

      <h3 className="main-name">{entry.title}</h3>
      {entry.text && <p className="main-name-info">{entry.text}</p>}

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