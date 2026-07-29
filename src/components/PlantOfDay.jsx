import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import dataPlant from "./data-plant";
import API_BASE_URL from "../config";

export default function PlantOfDay() {
  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    // Daily deterministic fallback seed
    const today = new Date();
    const dateSeed =
      today.getFullYear() * 10000 +
      (today.getMonth() + 1) * 100 +
      today.getDate();
    const fallbackPlant = dataPlant[dateSeed % dataPlant.length];

    fetch(`${API_BASE_URL}/api/plant-of-the-day`)
      .then((res) => {
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      .then((data) => {
        if (!cancelled && data && data.plant) {
          setPlant(data.plant);
        } else if (!cancelled) {
          setPlant(fallbackPlant);
        }
      })
      .catch(() => {
        if (!cancelled) {
          // Direct client-side fetch fallback to iNaturalist API if backend is unavailable
          const plantTerms = [
            'rose', 'monstera', 'sunflower', 'orchid', 'succulent', 'fern', 'cactus',
            'tulip', 'lavender', 'pothos', 'aloe', 'bamboo', 'maple', 'bonsai',
            'hibiscus', 'hydrangea', 'jasmine', 'dahlia', 'lily', 'peony'
          ];
          const term = plantTerms[dateSeed % plantTerms.length];
          fetch(`https://api.inaturalist.org/v1/taxa?q=${term}&rank=species&iconic_taxa=Plantae&per_page=15&locale=en`)
            .then((res) => res.json())
            .then((inatData) => {
              const item = inatData.results?.find((r) => r.preferred_common_name && r.default_photo?.medium_url);
              if (!cancelled && item) {
                setPlant({
                  id: `inat_${item.id}`,
                  title: item.preferred_common_name.charAt(0).toUpperCase() + item.preferred_common_name.slice(1),
                  text: item.name || '',
                  img: {
                    src: item.default_photo.medium_url,
                    alt: item.preferred_common_name
                  },
                  description: item.wikipedia_summary ? item.wikipedia_summary.replace(/<[^>]*>/g, '') : null
                });
              } else if (!cancelled) {
                setPlant(fallbackPlant);
              }
            })
            .catch(() => {
              if (!cancelled) setPlant(fallbackPlant);
            });
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="potd-section">
        <div className="potd-card" style={{ opacity: 0.85 }}>
          <div
            style={{
              width: "160px",
              height: "160px",
              borderRadius: "18px",
              background: "var(--border)",
              flexShrink: 0
            }}
          />
          <div className="potd-info" style={{ width: "100%" }}>
            <span className="potd-badge">🌿 Plant of the Day</span>
            <div style={{ height: "28px", width: "50%", background: "var(--border)", borderRadius: "8px", marginBottom: "10px" }} />
            <div style={{ height: "18px", width: "35%", background: "var(--border)", borderRadius: "6px", marginBottom: "14px" }} />
            <div style={{ height: "16px", width: "85%", background: "var(--border)", borderRadius: "4px" }} />
          </div>
        </div>
      </div>
    );
  }

  const currentPlant = plant || dataPlant[0];
  const imgSrc = typeof currentPlant.img === "string" ? currentPlant.img : (currentPlant.img?.src || "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=900&q=80");
  const imgAlt = typeof currentPlant.img === "string" ? currentPlant.title : (currentPlant.img?.alt || currentPlant.title);

  return (
    <div className="potd-section">
      <div className="potd-card">
        <img
          src={imgSrc}
          alt={imgAlt}
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=900&q=80";
          }}
        />
        <div className="potd-info">
          <span className="potd-badge">🌿 Plant of the Day</span>
          <h2>{currentPlant.title}</h2>
          <p className="potd-sci">{currentPlant.text}</p>
          <p>
            {currentPlant.description ||
              "Discover this amazing plant and learn all about its care requirements, origin, and interesting facts."}
          </p>
          <Link to={`/plants/${currentPlant.id}`} className="potd-link">
            Learn More →
          </Link>
        </div>
      </div>
    </div>
  );
}

 