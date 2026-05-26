import React from "react";
import { createPortal } from "react-dom";
import { Field, FieldArray, Form, Formik, ErrorMessage } from "formik";

import {
  createKnowledgeItem,
  updateKnowledgeItem,
} from "../../../api/knowledgeItems/knowledgeAPI";

import "../../knowledge/styles/knowledgeItems.css";
import "../styles/profile.css";

export default function PersonalInfoFormModal({
  isOpen,
  onClose,
  onSaved,
  profileItem,
}) {
  if (!isOpen) {
    return null;
  }

  const isEditMode = Boolean(profileItem?.id);

  const initialValues = {
    entries: personalInfoToEntries(profileItem?.attributes?.user),
  };

  const handleSubmit = async (values, formikHelpers) => {
    const { setSubmitting, setStatus, resetForm } = formikHelpers;

    try {
      setStatus(null);

      const userAttributes = entriesToPersonalInfo(values.entries);

      const payload = {
        title: "Personal Profile",
        content: "Profile-related personal information",
        type: "PROFILE",
        attributes: {
          user: userAttributes,
        },
      };

      if (isEditMode) {
        await updateKnowledgeItem(profileItem.id, payload);
      } else {
        await createKnowledgeItem(payload);
      }

      resetForm();
      await onSaved();
      onClose();
    } catch (error) {
      console.error("Failed to save personal information:", error);
      setStatus("Failed to save personal information.");
    } finally {
      setSubmitting(false);
    }
  };

  const modal = (
    <div className="knowledge-modal-overlay" onClick={onClose}>
      <div
        className="knowledge-modal-card create-personal-info-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="knowledge-modal-topbar">
          <span className="knowledge-modal-label">
            {isEditMode ? "Edit Personal Info" : "Create Personal Info"}
          </span>

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
          enableReinitialize
          validate={validatePersonalInfo}
          onSubmit={handleSubmit}
        >
          {({ values, isSubmitting, status }) => (
            <Form className="knowledge-form">
              <FieldArray name="entries">
                {({ push, remove }) => (
                  <div className="personal-info-form-list">
                    {values.entries.map((entry, index) => (
                      <div className="personal-info-form-row" key={index}>
                        <div className="knowledge-form-group">
                          <label
                            className="app-label"
                            htmlFor={`entries.${index}.key`}
                          >
                            Key
                          </label>

                          <Field
                            id={`entries.${index}.key`}
                            name={`entries.${index}.key`}
                            className="app-input"
                            placeholder="Example: location"
                          />

                          <ErrorMessage
                            name={`entries.${index}.key`}
                            component="p"
                            className="form-error-text"
                          />
                        </div>

                        <div className="knowledge-form-group">
                          <label
                            className="app-label"
                            htmlFor={`entries.${index}.value`}
                          >
                            Value
                          </label>

                          <Field
                            id={`entries.${index}.value`}
                            name={`entries.${index}.value`}
                            className="app-input"
                            placeholder="Example: Montreal"
                          />

                          <ErrorMessage
                            name={`entries.${index}.value`}
                            component="p"
                            className="form-error-text"
                          />
                        </div>

                        <button
                          type="button"
                          className="btn-app-outline personal-info-remove-button"
                          onClick={() => remove(index)}
                          disabled={values.entries.length === 1 || isSubmitting}
                        >
                          Remove
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      className="btn-app-outline"
                      onClick={() => push({ key: "", value: "" })}
                      disabled={isSubmitting}
                    >
                      + Add Field
                    </button>
                  </div>
                )}
              </FieldArray>

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
                  {isSubmitting
                    ? "Saving..."
                    : isEditMode
                      ? "Update Personal Info"
                      : "Save Personal Info"}
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

function personalInfoToEntries(userAttributes) {
  if (!userAttributes || Object.keys(userAttributes).length === 0) {
    return [{ key: "", value: "" }];
  }

  return Object.entries(userAttributes).map(([key, value]) => ({
    key,
    value: String(value),
  }));
}

function entriesToPersonalInfo(entries) {
  return entries.reduce((result, entry) => {
    const key = entry.key.trim();
    const value = entry.value.trim();

    if (key && value) {
      result[key] = value;
    }

    return result;
  }, {});
}

function validatePersonalInfo(values) {
  const errors = {};
  const entriesErrors = [];
  const seenKeys = new Set();

  values.entries.forEach((entry, index) => {
    const rowErrors = {};
    const key = entry.key.trim();

    if (!key) {
      rowErrors.key = "Key is required.";
    }

    if (!entry.value.trim()) {
      rowErrors.value = "Value is required.";
    }

    if (key && seenKeys.has(key.toLowerCase())) {
      rowErrors.key = "Duplicate key.";
    }

    if (key) {
      seenKeys.add(key.toLowerCase());
    }

    if (Object.keys(rowErrors).length > 0) {
      entriesErrors[index] = rowErrors;
    }
  });

  if (entriesErrors.length > 0) {
    errors.entries = entriesErrors;
  }

  return errors;
}