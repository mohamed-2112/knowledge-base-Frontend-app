import React from "react";
import { createPortal } from "react-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";

import { createKnowledgeItem } from '../../../api/knowledgeItems/knowledgeAPI';
import "../styles/knowledgeItems.css";

const initialValues = {
  title: "",
  content: "",
  type: "NOTE",
  tags: "",
  source: "manual",
};

export default function CreateKnowledgeItemModal({
  isOpen,
  onClose,
  onCreated,
}) {
  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (values, formikHelpers) => {
    const { setSubmitting, setStatus, resetForm } = formikHelpers;

    try {
      setStatus(null);

      const payload = {
        title: values.title.trim(),
        content: values.content.trim(),
        type: values.type,
        attributes: {
          tags: parseTags(values.tags),
          source: values.source.trim() || "manual",
        },
      };

      await createKnowledgeItem(payload);

      resetForm();
      await onCreated();
      onClose();
    } catch (error) {
      console.error("Failed to create knowledge item:", error);
      setStatus("Failed to create knowledge item.");
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
          <span className="knowledge-modal-label">Create Knowledge Item</span>

          <button
            type="button"
            className="knowledge-modal-close"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <Formik
          initialValues={initialValues}
          validate={validateCreateKnowledgeItem}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, status }) => (
            <Form className="knowledge-form">
              <div className="knowledge-form-group">
                <label className="app-label" htmlFor="title">
                  Title
                </label>

                <Field
                  id="title"
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
                <label className="app-label" htmlFor="type">
                  Type
                </label>

                <Field
                  as="select"
                  id="type"
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
                <label className="app-label" htmlFor="content">
                  Content
                </label>

                <Field
                  as="textarea"
                  id="content"
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
                  <label className="app-label" htmlFor="tags">
                    Tags
                  </label>

                  <Field
                    id="tags"
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
                  <label className="app-label" htmlFor="source">
                    Source
                  </label>

                  <Field
                    id="source"
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
                  {isSubmitting ? "Creating..." : "Create Item"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}

function validateCreateKnowledgeItem(values) {
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