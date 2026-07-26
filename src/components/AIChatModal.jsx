import { useState, useRef, useEffect } from "react";
import AIChat from "./AIChat";

export default function AIChatModal() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close the widget whenever the user clicks/taps anywhere outside of it
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
      {/* Floating Drawer Chat Window */}
      {isOpen && (
        <div className="ai-float-window">
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

      {/* Floating Action Button (FAB) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
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
