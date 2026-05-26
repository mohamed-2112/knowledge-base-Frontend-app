import React from "react";
import { createPortal } from "react-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";

import { updateKnowledgeItem } from "../../../api/knowledgeItems/knowledgeAPI";
import "../styles/knowledgeItems.css";

export default function EditKnowledgeItemModal({
  isOpen,
  item,
  loading,
  error,
  onClose,
  onUpdated,
}) {
  if (!isOpen) {
    return null;
  }

  const initialValues = {
    title: item?.title || "",
    content: item?.content || "",
    type: item?.type || "NOTE",
    tags: Array.isArray(item?.attributes?.tags)
      ? item.attributes.tags.join(", ")
      : "",
    source: item?.attributes?.source || "manual",
  };

  const handleSubmit = async (values, formikHelpers) => {
    const { setSubmitting, setStatus } = formikHelpers;

    try {
      setStatus(null);

      const payload = {
        title: values.title.trim(),
        content: values.content.trim(),
        type: values.type,
        attributes: {
          ...(item?.attributes || {}),
          tags: parseTags(values.tags),
          source: values.source.trim() || "manual",
        },
      };

      await updateKnowledgeItem(item.id, payload);

      await onUpdated();
      onClose();
    } catch (error) {
      console.error("Failed to update knowledge item:", error);
      setStatus("Failed to update knowledge item.");
    } finally {
      setSubmitting(false);
    }
  };

  const modal = (
    <div className="knowledge-modal-overlay" onClick={onClose}>
      <div
        className="knowledge-modal-card create-knowledge-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="knowledge-modal-topbar">
          <span className="knowledge-modal-label">Edit Knowledge Item</span>

          <button
            type="button"
            className="knowledge-modal-close"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        {loading && (
          <div className="knowledge-modal-state">
            <p className="empty-text">Loading item...</p>
          </div>
        )}

        {!loading && error && (
          <div className="knowledge-modal-state">
            <p className="error-text">{error}</p>
          </div>
        )}

        {!loading && !error && item && (
          <Formik
            initialValues={initialValues}
            enableReinitialize
            validate={validateKnowledgeItem}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, status }) => (
              <Form className="knowledge-form">
                <div className="knowledge-form-group">
                  <label className="app-label" htmlFor="edit-title">
                    Title
                  </label>

                  <Field
                    id="edit-title"
                    name="title"
                    className="app-input"
                    placeholder="Example: Spring Security Notes"
                  />

                  <ErrorMessage
                    name="title"
                    component="p"
                    className="form-error-text"
                  />
                </div>

                <div className="knowledge-form-group">
                  <label className="app-label" htmlFor="edit-type">
                    Type
                  </label>

                  <Field
                    as="select"
                    id="edit-type"
                    name="type"
                    className="app-select"
                  >
                    <option value="NOTE">Note</option>
                    <option value="LINK">Link</option>
                    <option value="PERSON">Person</option>
                    <option value="DOCUMENT">Document</option>
                  </Field>

                  <ErrorMessage
                    name="type"
                    component="p"
                    className="form-error-text"
                  />
                </div>

                <div className="knowledge-form-group">
                  <label className="app-label" htmlFor="edit-content">
                    Content
                  </label>

                  <Field
                    as="textarea"
                    id="edit-content"
                    name="content"
                    className="app-textarea"
                    placeholder="Write the knowledge content here..."
                    rows={5}
                  />

                  <ErrorMessage
                    name="content"
                    component="p"
                    className="form-error-text"
                  />
                </div>

                <div className="knowledge-form-grid">
                  <div className="knowledge-form-group">
                    <label className="app-label" htmlFor="edit-tags">
                      Tags
                    </label>

                    <Field
                      id="edit-tags"
                      name="tags"
                      className="app-input"
                      placeholder="spring, security, react"
                    />

                    <ErrorMessage
                      name="tags"
                      component="p"
                      className="form-error-text"
                    />
                  </div>

                  <div className="knowledge-form-group">
                    <label className="app-label" htmlFor="edit-source">
                      Source
                    </label>

                    <Field
                      id="edit-source"
                      name="source"
                      className="app-input"
                      placeholder="manual"
                    />

                    <ErrorMessage
                      name="source"
                      component="p"
                      className="form-error-text"
                    />
                  </div>
                </div>

                {status && <p className="error-text">{status}</p>}

                <div className="knowledge-form-actions">
                  <button
                    type="button"
                    className="btn-app-outline"
                    onClick={onClose}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn-app-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Updating..." : "Update Item"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}

function validateKnowledgeItem(values) {
  const errors = {};

  if (!values.title.trim()) {
    errors.title = "Title is required.";
  }

  if (!values.type.trim()) {
    errors.type = "Type is required.";
  }

  if (values.title.length > 255) {
    errors.title = "Title must be 255 characters or less.";
  }

  return errors;
}

function parseTags(tagsValue) {
  return tagsValue
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}