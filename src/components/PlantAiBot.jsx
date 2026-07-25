import { useState, useRef, useEffect } from "react";

const SAMPLE_PLANTS = [
  {
    name: "Monstera Deliciosa",
    scientific: "Monstera deliciosa",
    confidence: "99.2%",
    category: "Tropical Foliage",
    img: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=500&q=80",
    watering: "Water every 1-2 weeks, allowing soil to dry out between waterings.",
    light: "Bright to medium indirect light.",
    toxicity: "Mildly toxic to pets if chewed.",
    health: "Healthy & Vigorous 🌿",
    description: "Famous for its natural leaf holes (fenestrations). Thrives in warm, humid environments."
  },
  {
    name: "Snake Plant (Mother-in-Law's Tongue)",
    scientific: "Dracaena trifasciata",
    confidence: "98.7%",
    category: "Houseplant / Succulent",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2ZEbZRpF4opTmFNKReE9Ee1cuYJaML9-Agg&s",
    watering: "Water every 2-4 weeks. Very drought tolerant.",
    light: "Tolerates low light to bright indirect light.",
    toxicity: "Toxic to cats and dogs.",
    health: "Excellent Health 🐍",
    description: "An exceptionally hardy air-purifying plant with architectural upright leaves."
  },
  {
    name: "Aloe Vera",
    scientific: "Aloe barbadensis Miller",
    confidence: "97.9%",
    category: "Succulent",
    img: "https://myplantin.com/_next/image?url=https%3A%2F%2Fstrapi.myplantin.com%2Fsmall_leaf_ge67528b35_1920_0e56f75901.webp&w=1920&q=100",
    watering: "Water deeply every 3 weeks when soil is completely dry.",
    light: "Bright, direct to indirect sunlight.",
    toxicity: "Gel is soothing; outer leaf is mildly toxic to pets.",
    health: "Vibrant & Hydrated 🌵",
    description: "Succulent with thick gel-filled leaves known for soothing skin burns and air purification."
  },
  {
    name: "Fiddle Leaf Fig",
    scientific: "Ficus lyrata",
    confidence: "96.5%",
    category: "Indoor Tree",
    img: "https://images.unsplash.com/photo-1545241047-6083a3684587?w=500&q=80",
    watering: "Water when top 2 inches of soil feel dry (about once a week).",
    light: "Consistent bright, filtered light.",
    toxicity: "Toxic to pets.",
    health: "Good Condition (Needs stable spot) 🍃",
    description: "Popular interior design plant with huge violin-shaped glossy leaves."
  }
];

export default function PlantAiBot({ isOpen, setIsOpen }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Hello! I'm your Plantio AI Assistant 🌿. Upload a photo of any plant or select a sample image, and I'll instantly identify it and provide care tips!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isScanning]);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      processImageIdentification(imageUrl, file.name);
    }
  };

  const processImageIdentification = (imageUrl, name = "uploaded_plant.jpg") => {
    setSelectedImage(imageUrl);
    
    // Add user message with image
    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: "Can you identify this plant for me?",
      image: imageUrl,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsScanning(true);

    // Simulate AI Identification matching
    setTimeout(() => {
      // Pick random plant match or sample plant
      const matchedPlant = SAMPLE_PLANTS[Math.floor(Math.random() * SAMPLE_PLANTS.length)];
      
      const botResponse = {
        id: Date.now() + 1,
        sender: "bot",
        plantData: {
          ...matchedPlant,
          img: imageUrl // use the uploaded image
        },
        text: `✨ I identified your plant as **${matchedPlant.name}** (*${matchedPlant.scientific}*) with **${matchedPlant.confidence}** confidence!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setIsScanning(false);
      setMessages((prev) => [...prev, botResponse]);
    }, 2200);
  };

  const handleSampleClick = (sample) => {
    setSelectedImage(sample.img);
    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: `Identify this sample: ${sample.name}`,
      image: sample.img,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsScanning(true);

    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        sender: "bot",
        plantData: sample,
        text: `✨ Identified as **${sample.name}** (*${sample.scientific}*) with **${sample.confidence}** confidence!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setIsScanning(false);
      setMessages((prev) => [...prev, botResponse]);
    }, 1800);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText.trim();
    setInputText("");

    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages((prev) => [...prev, userMsg]);

    // Simulated Bot Reply
    setTimeout(() => {
      let replyText = "That's a great question! For optimal plant health, ensure proper drainage, bright indirect light, and avoid overwatering. Would you like care instructions for a specific plant?";
      
      const lower = userText.toLowerCase();
      if (lower.includes("yellow") || lower.includes("brown")) {
        replyText = "Yellowing or browning leaves usually indicate overwatering or poor drainage. Check if the top 2 inches of soil are wet. Let it dry out slightly between waterings!";
      } else if (lower.includes("water") || lower.includes("how often")) {
        replyText = "Most houseplants prefer the 'soak and dry' method: water thoroughly until it drains out the bottom, then wait until the top soil is dry before watering again.";
      } else if (lower.includes("light") || lower.includes("sun")) {
        replyText = "Bright, indirect light is best for 80% of houseplants. Avoid harsh direct afternoon sunlight which can scorch fragile leaves!";
      } else if (lower.includes("pet") || lower.includes("cat") || lower.includes("dog")) {
        replyText = "Pet safety is important! Spider Plants, Boston Ferns, and Peperomia are 100% pet-safe. Plants like Pothos, Monstera, and Snake Plants should be kept out of reach.";
      }

      const botMsg = {
        id: Date.now() + 1,
        sender: "bot",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 1000);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        className="ai-bot-fab"
        onClick={() => setIsOpen(!isOpen)}
        title="Plantio AI Plant Identifier & Bot"
      >
        <span className="fab-icon">🤖</span>
        <span className="fab-text">AI Plant ID</span>
        <span className="fab-pulse"></span>
      </button>

      {/* Chat Window Modal / Popup */}
      {isOpen && (
        <div className="ai-bot-window">
          {/* Header */}
          <div className="ai-bot-header">
            <div className="ai-bot-header-info">
              <div className="bot-avatar">🌿</div>
              <div>
                <h3>Plantio AI Identifier</h3>
                <span className="bot-status"><span className="online-dot"></span> Online & Ready to Scan</span>
              </div>
            </div>
            <button className="ai-bot-close" onClick={() => setIsOpen(false)}>✕</button>
          </div>

          {/* Body / Messages */}
          <div className="ai-bot-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`ai-msg ${msg.sender}`}>
                {msg.sender === "bot" && <div className="msg-avatar">🌱</div>}
                <div className="msg-content">
                  {msg.image && (
                    <div className="msg-image-wrap">
                      <img src={msg.image} alt="Plant photo" />
                    </div>
                  )}
                  {msg.text && <p className="msg-text">{msg.text}</p>}

                  {/* AI Plant Result Card */}
                  {msg.plantData && (
                    <div className="ai-plant-card">
                      <div className="ai-card-header">
                        <h4>{msg.plantData.name}</h4>
                        <span className="ai-confidence">{msg.plantData.confidence} Match</span>
                      </div>
                      <p className="ai-scientific">{msg.plantData.scientific}</p>
                      
                      <div className="ai-card-details">
                        <div className="ai-detail-item">
                          <span>💧 Watering:</span>
                          <p>{msg.plantData.watering}</p>
                        </div>
                        <div className="ai-detail-item">
                          <span>☀️ Light:</span>
                          <p>{msg.plantData.light}</p>
                        </div>
                        <div className="ai-detail-item">
                          <span>🩺 Health:</span>
                          <p>{msg.plantData.health}</p>
                        </div>
                        <div className="ai-detail-item">
                          <span>⚠️ Pet Safety:</span>
                          <p>{msg.plantData.toxicity}</p>
                        </div>
                      </div>
                      <p className="ai-desc">{msg.plantData.description}</p>
                    </div>
                  )}
                  <span className="msg-time">{msg.timestamp}</span>
                </div>
              </div>
            ))}

            {/* Scanning animation overlay when processing */}
            {isScanning && (
              <div className="ai-msg bot">
                <div className="msg-avatar">🌱</div>
                <div className="msg-content scanning-box">
                  <div className="scanner-beam"></div>
                  <p>🔍 Scanning plant features & matching species database...</p>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Try Samples */}
          <div className="ai-samples-bar">
            <span>Try sample:</span>
            {SAMPLE_PLANTS.map((sample, idx) => (
              <button key={idx} onClick={() => handleSampleClick(sample)}>
                {sample.name.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Input & Actions */}
          <div className="ai-bot-footer">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageUpload}
            />

            <button
              type="button"
              className="upload-photo-btn"
              onClick={() => fileInputRef.current?.click()}
              title="Upload Plant Photo"
            >
              📷 Photo
            </button>

            <form onSubmit={handleSendMessage} className="ai-input-form">
              <input
                type="text"
                placeholder="Ask AI or upload photo..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <button type="submit" disabled={!inputText.trim()}>
                ➔
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
