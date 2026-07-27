import { useState, useRef, useEffect } from "react";
import AIChat from "./AIChat";

export default function AIChatModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false);
  const containerRef = useRef(null);

  const toggleOpen = () => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next) setHasOpenedOnce(true);
      return next;
    });
  };

  useEffect(() => {
    const handleAskEvent = () => {
      setHasOpenedOnce(true);
      setIsOpen(true);
    };
    window.addEventListener("plantio_ai_doctor_ask", handleAskEvent);
    return () => window.removeEventListener("plantio_ai_doctor_ask", handleAskEvent);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [isOpen]);

  return (
    <div className="ai-float-widget-container" ref={containerRef}>
      
      {hasOpenedOnce && (
        <div className={`ai-float-window ${isOpen ? "" : "ai-float-window-closed"}`}>
          <div className="ai-float-header">
            <div className="ai-float-title">
              <span className="ai-status-pulse"></span>
              <h3>Plantio AI Doctor</h3>
            </div>
            <div className="ai-float-actions">
              <button onClick={() => setIsOpen(false)} className="close-float-btn" title="Close Chat Drawer">
                ✕
              </button>
            </div>
          </div>

          <div className="ai-float-body">
            <AIChat isEmbedded={true} />
          </div>
        </div>
      )}

      <button
        onClick={toggleOpen}
        className={`ai-fab-button ${isOpen ? "open" : ""}`}
        aria-label="Toggle AI Plant Doctor Chat"
        title="Open AI Plant Doctor Chat"
      >
        <span className="fab-icon">{isOpen ? "✕" : "🤖"}</span>
        <span className="fab-badge">AI Doctor</span>
        <span className="fab-pulse-dot"></span>
      </button>
    </div>
  );
}
