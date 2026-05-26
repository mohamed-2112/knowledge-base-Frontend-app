import React, { useState } from "react";
import { createPortal } from "react-dom";

import { deleteKnowledgeItem } from "../../../api/knowledgeItems/knowledgeAPI";
import "../styles/knowledgeItems.css";

export default function DeleteKnowledgeItemModal({
  isOpen,
  item,
  onClose,
  onDeleted,
}) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen || !item) {
    return null;
  }

  const handleDelete = async () => {
    try {
      setDeleting(true);
      setError("");

      await deleteKnowledgeItem(item.id);

      await onDeleted();
      onClose();
    } catch (error) {
      console.error("Failed to delete knowledge item:", error);
      setError("Failed to delete knowledge item.");
    } finally {
      setDeleting(false);
    }
  };

  const modal = (
    <div className="knowledge-modal-overlay" onClick={onClose}>
      <div
        className="knowledge-modal-card delete-knowledge-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="knowledge-modal-topbar">
          <span className="knowledge-modal-label">Delete Knowledge Item</span>

          <button
            type="button"
            className="knowledge-modal-close"
            onClick={onClose}
            disabled={deleting}
          >
            ×
          </button>
        </div>

        <div className="delete-modal-content">
          <h3 className="delete-modal-title">
            Are you sure you want to delete this item?
          </h3>

          <p className="delete-modal-description">
            This action cannot be undone.
          </p>

          <div className="delete-item-preview">
            <span className="app-badge">{item.type}</span>
            <h4>{item.title}</h4>
            <p>{item.content || "No content provided."}</p>
          </div>

          {error && <p className="error-text">{error}</p>}

          <div className="knowledge-form-actions">
            <button
              type="button"
              className="btn-app-outline"
              onClick={onClose}
              disabled={deleting}
            >
              Cancel
            </button>

            <button
              type="button"
              className="btn-app-danger"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete Item"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}