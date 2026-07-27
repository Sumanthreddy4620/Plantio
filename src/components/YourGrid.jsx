const PLANT_PLACEHOLDER =
  "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80";

export function getWateringStatus(lastWatered, frequencyDays) {
  const last = new Date(lastWatered);
  const today = new Date();
  const daysSince = Math.floor((today - last) / (1000 * 60 * 60 * 24));
  const freq = parseInt(frequencyDays, 10) || 7;
  const diff = freq - daysSince;

  if (diff < 0) {
    const overDays = Math.abs(diff);
    return {
      label: `🔴 Overdue by ${overDays}d (Water now!)`,
      cls: "due",
      statusType: "overdue"
    };
  }
  if (diff === 0 || diff === 1) {
    return {
      label: "🟡 Water Today",
      cls: "soon",
      statusType: "soon"
    };
  }
  return {
    label: `🟢 Watered (${diff}d left)`,
    cls: "ok",
    statusType: "ok"
  };
}

export default function YourGrid({ entry, onDelete, onWater, onEdit }) {
  const imgSrc = entry.imgUrl || PLANT_PLACEHOLDER;
  const status = getWateringStatus(entry.lastWatered, entry.wateringFrequency);

  const handleAskAIDoctor = () => {
    window.dispatchEvent(
      new CustomEvent("plantio_ai_doctor_ask", {
        detail: {
          prompt: `Give me tailored care, sunlight, and fertilizer advice for my ${entry.title}`,
          imageUrl: entry.imgUrl
        }
      })
    );
  };

  return (
    <div className="your-entry">
      <div className="main-image-container">
        <img
          className="main-image"
          src={imgSrc}
          alt={entry.title}
          onError={(e) => { e.target.src = PLANT_PLACEHOLDER; }}
        />
        <div className="your-card-top-btns">
          {onEdit && (
            <button
              className="your-edit-btn"
              onClick={onEdit}
              title="Modify plant & watering reminder"
              aria-label="Modify plant"
            >
              ✏️
            </button>
          )}
          <button
            className="your-delete-btn"
            onClick={onDelete}
            title="Delete plant"
            aria-label="Delete plant"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        </div>
      </div>

      <div className="your-card-body">
        <h3 className="main-name">{entry.title}</h3>
        {entry.text && <p className="main-name-info">{entry.text}</p>}

        <div className="your-card-footer">
          <button
            type="button"
            className={`watering-badge-btn ${status.cls}`}
            onClick={onWater}
            title="Click to mark as watered today"
          >
            {status.label}
          </button>

          <button
            type="button"
            className="ask-ai-card-btn"
            onClick={handleAskAIDoctor}
            title={`Ask AI Doctor about ${entry.title}`}
          >
            ✨ Ask AI Doctor
          </button>
        </div>
      </div>
    </div>
  );
}