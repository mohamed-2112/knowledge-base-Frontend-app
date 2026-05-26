import React, { useEffect } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";

import useUiCustomization from "../hooks/useUiCustomization";

import "../../knowledge/styles/knowledgeItems.css";
import "../styles/uiCustomization.css";

const initialValues = {
  message:
    "Make my dashboard dark, compact, professional, and focused on profile and knowledge summary.",
};

export default function UiCustomizationPanel({ onTemplateApplied }) {
  const {
    draft,
    activeTemplate,
    loading,
    applying,
    error,
    createDraft,
    applyDraft,
    fetchActiveTemplate,
  } = useUiCustomization();

  useEffect(() => {
    fetchActiveTemplate("dashboard");
  }, []);

  const handleSubmit = async (values, formikHelpers) => {
    const { setSubmitting, setStatus } = formikHelpers;

    try {
      setStatus(null);

      const result = await createDraft(values.message.trim(), "dashboard");

      if (!result) {
        setStatus("Failed to generate a UI customization draft.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleApplyDraft = async () => {
    if (!draft?.draft_id) {
      return;
    }

    const result = await applyDraft(draft.draft_id);

    if (result) {
      await fetchActiveTemplate("dashboard");
      if (onTemplateApplied) {
        await onTemplateApplied(result);
      }
    }
  };

  const handleRefreshActiveTemplate = async () => {
    await fetchActiveTemplate("dashboard");
  };

  const draftTemplate = draft?.draft_template || draft?.template || null;
  const currentActiveTemplate = activeTemplate?.template || null;

  return (
    <section className="app-section ui-customization-section">
      <div className="ui-customization-header">
        <div className="ui-customization-header-content">
          <span className="ui-customization-kicker">AI Agent</span>

          <h2 className="section-title ui-customization-title">
            Interface Customization
          </h2>

          <p className="section-description ui-customization-description">
            Describe how you want your dashboard to look. The agent will create a safe
            draft that you can review before applying.
          </p>
        </div>

        <span className="app-badge ui-customization-status-badge">
          Preview First
        </span>
      </div>

      <Formik
        initialValues={initialValues}
        validate={validateCustomizationRequest}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, status }) => (
          <Form className="knowledge-form ui-customization-form">
            <div className="knowledge-form-group">
              <label className="app-label" htmlFor="ui-message">
                Customization Request
              </label>

              <Field
                as="textarea"
                id="ui-message"
                name="message"
                className="app-textarea ui-customization-textarea"
                placeholder="Example: Make my dashboard cleaner, compact, and focused on knowledge items."
                rows={5}
              />

              <ErrorMessage
                name="message"
                component="p"
                className="form-error-text"
              />

              <p className="ui-customization-hint">
                The agent can change layout, theme, spacing, and component
                variants. It cannot change authentication, API calls, or core
                app logic.
              </p>
            </div>

            {(status || error) && (
              <p className="error-text">{status || error}</p>
            )}

            <div className="knowledge-form-actions ui-customization-actions">
              <button
                type="button"
                className="btn-app-outline"
                onClick={handleRefreshActiveTemplate}
                disabled={loading || isSubmitting || applying}
              >
                Refresh Active
              </button>

              <button
                type="button"
                className="btn-app-outline"
                onClick={handleApplyDraft}
                disabled={applying || !draft?.draft_id}
              >
                {applying ? "Applying..." : "Apply Draft"}
              </button>

              <button
                type="submit"
                className="btn-app-primary"
                disabled={loading || isSubmitting}
              >
                {loading || isSubmitting ? "Generating..." : "Generate Draft"}
              </button>
            </div>
          </Form>
        )}
      </Formik>

      <div className="ui-template-preview-grid">
        <TemplatePreviewCard
          title="Generated Draft"
          emptyText="No draft generated yet."
          template={draftTemplate}
          meta={
            draft?.draft_id
              ? `Draft ID: ${draft.draft_id}`
              : "Generate a draft to preview it here."
          }
        />

        <TemplatePreviewCard
          title="Active Template"
          emptyText="No active template yet. The default React dashboard is currently used."
          template={currentActiveTemplate}
          meta={
            activeTemplate?.version
              ? `Version: ${activeTemplate.version}`
              : "Default dashboard"
          }
        />
      </div>
    </section>
  );
}

function TemplatePreviewCard({ title, emptyText, template, meta }) {
  if (!template) {
    return (
      <div className="app-card ui-template-preview-card">
        <div className="ui-template-preview-topbar">
          <h3 className="ui-template-preview-title">{title}</h3>
          <span className="ui-template-preview-meta">{meta}</span>
        </div>

        <p className="empty-text ui-template-empty-text">{emptyText}</p>
      </div>
    );
  }

  const nodes = flattenTemplateNodes(template.tree);

  return (
    <div className="app-card ui-template-preview-card">
      <div className="ui-template-preview-topbar">
        <h3 className="ui-template-preview-title">{title}</h3>
        <span className="ui-template-preview-meta">{meta}</span>
      </div>

      <div className="ui-template-summary">
        <span className="ui-template-page-chip">
          Page: {template.page}
        </span>
      </div>

      <div className="ui-theme-chip-list">
        <span className="ui-theme-chip">Mode: {template.theme.mode}</span>
        <span className="ui-theme-chip">
          Color: {template.theme.primary_color}
        </span>
        <span className="ui-theme-chip">
          Density: {template.theme.density}
        </span>
        <span className="ui-theme-chip">Radius: {template.theme.radius}</span>
      </div>

      <div className="ui-template-node-list">
        {nodes.map((node, index) => (
          <div className="ui-template-node-row" key={`${node.type}-${index}`}>
            <span className="app-badge">{node.type}</span>

            <code className="ui-template-node-props">
              {JSON.stringify(node.props)}
            </code>
          </div>
        ))}
      </div>

      <details className="ui-template-json-details">
        <summary>View JSON</summary>

        <pre className="ui-template-json">
          {JSON.stringify(template, null, 2)}
        </pre>
      </details>
    </div>
  );
}

function flattenTemplateNodes(rootNode) {
  const result = [];

  function walk(node) {
    if (!node) {
      return;
    }

    result.push(node);

    if (Array.isArray(node.children)) {
      node.children.forEach(walk);
    }
  }

  walk(rootNode);

  return result;
}

function validateCustomizationRequest(values) {
  const errors = {};

  if (!values.message.trim()) {
    errors.message = "Customization request is required.";
  }

  if (values.message.length < 10) {
    errors.message = "Please describe the change in more detail.";
  }

  if (values.message.length > 1000) {
    errors.message = "Request must be 1000 characters or less.";
  }

  return errors;
}