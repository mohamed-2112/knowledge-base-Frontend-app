import React, {useEffect} from "react";
import { createPortal } from "react-dom";
import "../styles/knowledgeItems.css";

export default function KnowledgeItemDetails({item, loading, error, onClose}) {

    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleEscape);

        // prevent background scrolling while modal is open
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
        document.removeEventListener("keydown", handleEscape);
        document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  const modalContent = (
    <div className="knowledge-modal-overlay" onClick={onClose}>
      <div
        className="knowledge-modal-card"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="knowledge-modal-topbar">
          <span className="knowledge-modal-label">Knowledge Details</span>

          <button
            type="button"
            className="knowledge-modal-close"
            onClick={onClose}
          >
            X
          </button>
        </div>

        {loading && (
          <div className="knowledge-modal-state">
            <p className="empty-text">Loading item details...</p>
          </div>
        )}

        {!loading && error && (
          <div className="knowledge-modal-state">
            <p className="error-text">{error}</p>
          </div>
        )}

        {!loading && !error && item && (
          <>
            <div className="knowledge-modal-header">
              <span className="app-badge">{item.type}</span>
              <h3 className="knowledge-modal-title">{item.title}</h3>
            </div>

            <p className="knowledge-modal-content">
              {item.content || "No content provided."}
            </p>

            <div className="knowledge-modal-meta">
              <span>Created: {formatDate(item.createdAt)}</span>
              <span>Updated: {formatDate(item.updatedAt)}</span>
            </div>

            {item.attributes && Object.keys(item.attributes).length > 0 && (
                <div className="knowledge-modal-list">
                    {Object.entries(item.attributes).map(([key, value]) => (
                        <div className="knowledge-info-row" key={key}>
                            <span className="knowledge-info-key">{formatLabel(key)}</span>
                            <span className="knowledge-info-value">{String(value)}</span>
                        </div>
                    ))}
                </div>
            
        
            )}
          </>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);

}

function formatDate(value) {
    if (!value) return "N/A";

    return new Date(value).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

function formatLabel(value) {
    return value.replace(/([A-Z])/g, ' $1').replace(/_/g, " ").replace(/^./, (char) => char.toUpperCase());
}