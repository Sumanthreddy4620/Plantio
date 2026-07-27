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

export default function YourGrid({ entry, onWater, onEdit }) {
  const imgSrc = entry.imgUrl || PLANT_PLACEHOLDER;
  const status = getWateringStatus(entry.lastWatered, entry.wateringFrequency);

  const handleAskAIDoctor = (e) => {
    e.stopPropagation();
    window.dispatchEvent(
      new CustomEvent("plantio_ai_doctor_ask", {
        detail: {
          prompt: `Give me tailored care, sunlight, and fertilizer advice for my ${entry.title}`,
          imageUrl: entry.imgUrl
        }
      })
    );
  };

  const handleWaterClick = (e) => {
    e.stopPropagation();
    if (onWater) onWater();
  };

  return (
    <div
      className="your-entry"
      onClick={onEdit}
      title="Click to view plant details, edit, or delete"
      style={{ cursor: "pointer" }}
    >
      <div className="main-image-container">
        <img
          className="main-image"
          src={imgSrc}
          alt={entry.title}
          onError={(e) => { e.target.src = PLANT_PLACEHOLDER; }}
        />
      </div>

      <div className="your-card-body">
        <h3 className="main-name">{entry.title}</h3>
        {entry.text && <p className="main-name-info">{entry.text}</p>}

        <div className="your-card-footer">
          <button
            type="button"
            className={`watering-badge-btn ${status.cls}`}
            onClick={handleWaterClick}
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