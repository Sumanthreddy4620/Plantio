import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";

export default function AIChat({ isEmbedded = false }) {
  const [messages, setMessages] = useState([
    {
      id: "msg_welcome",
      sender: "ai",
      text: "Hello! I am your **Plantio AI Doctor & Botanical Assistant** 🌿✨\n\nSend me a text query, paste an image URL, or upload a photo of your plant/leaf to instantly identify species, diagnose diseases, or get tailored care advice!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [photoBase64, setPhotoBase64] = useState("");
  const [photoName, setPhotoName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const fileInputRef = useRef(null);
  const chatBottomRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handle Photo File Selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      handleToast("⚠️ Please select a valid image file (JPG, PNG, WEBP).");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      handleToast("⚠️ Image size exceeds 8MB. Please choose a smaller photo.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPhotoBase64(reader.result);
      setPhotoName(file.name);
      handleToast("📸 Photo attached! Now send your query or submit to analyze.");
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPhotoBase64("");
    setPhotoName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveUrl = () => {
    setImageUrl("");
    setShowUrlInput(false);
  };

  // Quick prompt click handler
  const handlePromptChip = (chipText) => {
    setInputPrompt(chipText);
  };

  // Submit AI Request
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputPrompt.trim() && !imageUrl.trim() && !photoBase64) {
      handleToast("⚠️ Please enter a text message, attach a photo, or paste an image URL.");
      return;
    }

    const userMessage = {
      id: `msg_user_${Date.now()}`,
      sender: "user",
      text: inputPrompt.trim() || (photoBase64 ? "Attached photo for identification" : "Analyzed image URL"),
      imageUrl: imageUrl.trim() || null,
      imageBase64: photoBase64 || null,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentPrompt = inputPrompt;
    const currentUrl = imageUrl;
    const currentBase64 = photoBase64;

    // Reset inputs
    setInputPrompt("");
    setImageUrl("");
    setShowUrlInput(false);
    setPhotoBase64("");
    setPhotoName("");
    if (fileInputRef.current) fileInputRef.current.value = "";

    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/ai-chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: currentPrompt,
          imageUrl: currentUrl,
          imageBase64: currentBase64,
          conversationHistory: messages.slice(-6).map(m => ({ role: m.sender, content: m.text }))
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "AI response error");
      }

      const data = await res.json();
      const aiResponse = {
        id: `msg_ai_${Date.now()}`,
        sender: "ai",
        text: data.message || "I analyzed your input against our botanical database.",
        diagnosis: data.diagnosis || null,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg_err_${Date.now()}`,
          sender: "ai",
          text: `⚠️ Sorry, I encountered an issue: ${err.message}. Please try again.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Add identified plant to User's saved plants
  const handleAddToMyPlants = async (diagnosis) => {
    const token = localStorage.getItem("plantio_token");
    const userStr = localStorage.getItem("plantio_user") || sessionStorage.getItem("plantio_user");

    if (!token || !userStr) {
      handleToast("🔒 Please log in to add plants to your garden!");
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/user-plants`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          title: diagnosis.title,
          text: diagnosis.scientificName ? `Scientific name: ${diagnosis.scientificName}` : diagnosis.category,
          imgUrl: diagnosis.img?.src || "",
          wateringFrequency: 7,
          lastWatered: new Date().toISOString().split("T")[0]
        })
      });

      if (res.ok) {
        handleToast(`🎉 Success! Added "${diagnosis.title}" to Your Plants!`);
      } else {
        const err = await res.json();
        handleToast(`⚠️ ${err.error || "Failed to add plant"}`);
      }
    } catch (e) {
      handleToast("⚠️ Network error while saving plant.");
    }
  };

  return (
    <div className={`ai-chat-container ${isEmbedded ? "embedded" : "standalone"}`}>
      {/* Header Banner if standalone view */}
      {!isEmbedded && (
        <div className="ai-chat-header-banner">
          <div className="ai-header-content">
            <div className="ai-badge-icon">🤖🌿</div>
            <div>
              <h2>Plantio AI Plant & Disease Doctor</h2>
              <p>Instant Multimodal Identification & Botanical Care Assistant</p>
            </div>
          </div>
          <span className="live-api-tag">✨ Powered by Live 300,000+ Species API</span>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="ai-toast-notification">
          {toastMessage}
        </div>
      )}

      {/* Chat Messages Body */}
      <div className="ai-chat-body">
        {messages.map((msg) => (
          <div key={msg.id} className={`ai-chat-bubble-wrapper ${msg.sender}`}>
            <div className="ai-avatar">
              {msg.sender === "ai" ? "🌿" : "👤"}
            </div>

            <div className="ai-chat-bubble">
              <div className="bubble-sender-name">
                {msg.sender === "ai" ? "Plantio AI Doctor" : "You"}
                <span className="bubble-time">{msg.timestamp}</span>
              </div>

              {/* User attached photo preview */}
              {msg.imageBase64 && (
                <div className="chat-attached-image-wrapper">
                  <img src={msg.imageBase64} alt="Attached plant photo" className="chat-attached-img" />
                  <span className="attached-img-tag">📸 Uploaded Photo</span>
                </div>
              )}

              {/* User attached URL preview */}
              {msg.imageUrl && (
                <div className="chat-attached-image-wrapper">
                  <img src={msg.imageUrl} alt="Attached plant URL" className="chat-attached-img" onError={(e) => { e.target.style.display = 'none'; }} />
                  <span className="attached-img-tag">🔗 Image URL</span>
                </div>
              )}

              {/* Text Message */}
              <div className="bubble-text">
                {msg.text.split("\n\n").map((paragraph, pIdx) => (
                  <p key={pIdx}>
                    {paragraph.split("\n").map((line, lIdx) => (
                      <span key={lIdx}>
                        {line.includes("**") ? (
                          line.split("**").map((part, bIdx) => (
                            bIdx % 2 === 1 ? <strong key={bIdx}>{part}</strong> : part
                          ))
                        ) : line}
                        {lIdx < paragraph.split("\n").length - 1 && <br />}
                      </span>
                    ))}
                  </p>
                ))}
              </div>

              {/* Diagnostic AI Result Card */}
              {msg.diagnosis && (() => {
                const d = msg.diagnosis;
                const isPestOrDisease = d.category === "Pest" || d.category === "Disease";
                const statusMeta = {
                  "Healthy": { label: "✅ Healthy", className: "status-healthy" },
                  "Diseased": { label: "⚠️ Diseased", className: "status-diseased" },
                  "Pest Damage": { label: "🐛 Pest Damage", className: "status-pest" },
                  "Unclear": { label: "❔ Unclear", className: "status-unclear" }
                };
                const status = statusMeta[d.healthStatus];
                const showAlertDetails = isPestOrDisease || d.healthStatus === "Diseased" || d.healthStatus === "Pest Damage";

                return (
                  <div className={`ai-diagnosis-card ${isPestOrDisease ? "is-alert" : ""}`}>
                    <div className="diagnosis-card-header">
                      {d.img?.src && (
                        <img src={d.img.src} alt={d.title} className="diagnosis-thumbnail" />
                      )}
                      <div className="diagnosis-title-box">
                        <span className={`diagnosis-category-pill ${isPestOrDisease ? "pill-alert" : ""}`}>{d.category || "Botany"}</span>
                        <h4>{d.title}</h4>
                        {d.scientificName && (
                          <p className="diagnosis-scientific"><em>{d.scientificName}</em></p>
                        )}
                      </div>
                      <div className="diagnosis-badges">
                        <span className="diagnosis-confidence">{d.confidence || "Match"}</span>
                        {status && <span className={`diagnosis-status-badge ${status.className}`}>{status.label}</span>}
                      </div>
                    </div>

                    {/* Plant Care Specs — shown only for actual plant identifications, never for pests/diseases */}
                    {!isPestOrDisease && d.care && (
                      <div className="diagnosis-care-grid">
                        <div><span>💧 Water</span><strong>{d.care.watering}</strong></div>
                        <div><span>☀️ Light</span><strong>{d.care.light}</strong></div>
                        <div><span>🪴 Soil</span><strong>{d.care.soil}</strong></div>
                        <div><span>⚡ Level</span><strong>{d.care.difficulty}</strong></div>
                        <div><span>☠️ Toxicity</span><strong>{d.care.toxicity}</strong></div>
                      </div>
                    )}

                    {/* Symptoms / Treatment / Prevention — for pests, diseases, or a plant showing signs of trouble */}
                    {showAlertDetails && (d.symptoms || d.treatment || d.prevention) && (
                      <div className="diagnosis-alert-grid">
                        {d.symptoms && (
                          <div className="alert-row">
                            <span>🔍 Symptoms</span>
                            <p>{d.symptoms}</p>
                          </div>
                        )}
                        {d.treatment && (
                          <div className="alert-row">
                            <span>💊 Treatment</span>
                            <p>{d.treatment}</p>
                          </div>
                        )}
                        {d.prevention && (
                          <div className="alert-row">
                            <span>🛡️ Prevention</span>
                            <p>{d.prevention}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Card Actions */}
                    <div className="diagnosis-card-actions">
                      {!isPestOrDisease && (
                        <button
                          onClick={() => handleAddToMyPlants(d)}
                          className="add-to-garden-btn"
                        >
                          ➕ Add to My Plants
                        </button>
                      )}
                      {d.wikipediaUrl && (
                        <a
                          href={d.wikipediaUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="wiki-link-btn"
                        >
                          📖 Wikipedia Details
                        </a>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        ))}

        {/* Loading Spinner Indicator */}
        {isLoading && (
          <div className="ai-chat-bubble-wrapper ai loading">
            <div className="ai-avatar">🌿</div>
            <div className="ai-chat-bubble loading-bubble">
              <div className="typing-dots">
                <span></span><span></span><span></span>
              </div>
              <span className="loading-text">Analyzing plant database & multi-modal vision...</span>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Quick Prompt Chips */}
      <div className="ai-quick-chips">
        <button onClick={() => handlePromptChip("🌿 What plant is this? Please identify this photo.")}>🌿 Identify Plant</button>
        <button onClick={() => handlePromptChip("🍂 Why are my plant leaves turning yellow with brown spots?")}>🍂 Diagnose Leaf Spots</button>
        <button onClick={() => handlePromptChip("💧 How often should I water my indoor houseplants?")}>💧 Water Schedule</button>
        <button onClick={() => handlePromptChip("🐛 How do I treat aphids and spider mites organically?")}>🐛 Pest Treatment</button>
      </div>

      {/* Attached Media Chips */}
      {(photoBase64 || imageUrl) && (
        <div className="ai-attachment-preview-bar">
          {photoBase64 && (
            <div className="attachment-chip">
              <img src={photoBase64} alt="Attached upload" className="attachment-thumb" />
              <span>📸 {photoName || "Photo Attached"}</span>
              <button type="button" onClick={handleRemovePhoto} title="Remove Photo">✕</button>
            </div>
          )}

          {imageUrl && (
            <div className="attachment-chip">
              <span>🔗 {imageUrl.slice(0, 30)}...</span>
              <button type="button" onClick={handleRemoveUrl} title="Remove Image URL">✕</button>
            </div>
          )}
        </div>
      )}

      {/* Image URL Modal Input Row */}
      {showUrlInput && (
        <div className="ai-url-input-row">
          <input
            type="url"
            placeholder="Paste direct plant image URL (e.g. https://example.com/leaf.jpg)..."
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          <button type="button" onClick={() => setShowUrlInput(false)}>Done</button>
        </div>
      )}

      {/* Input Form Bar */}
      <form onSubmit={handleSubmit} className="ai-chat-form">
        {/* Hidden File Input */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        {/* Photo Upload Icon Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={`ai-tool-btn ${photoBase64 ? "active" : ""}`}
          title="Upload Photo / Capture Camera"
        >
          📷
        </button>

        {/* Image URL Icon Button */}
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className={`ai-tool-btn ${imageUrl ? "active" : ""}`}
          title="Attach Image Link URL"
        >
          🔗
        </button>

        {/* Text Prompt Input */}
        <input
          type="text"
          placeholder="Ask AI Doctor, paste image URL, or upload photo..."
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          disabled={isLoading}
          className="ai-chat-input"
        />

        {/* Send Submit Button */}
        <button
          type="submit"
          disabled={isLoading || (!inputPrompt.trim() && !imageUrl.trim() && !photoBase64)}
          className="ai-send-btn"
        >
          Send ➔
        </button>
      </form>
    </div>
  );
}
