import { useState } from "react";
import {
  applyUiCustomizationDraft,
  createUiCustomizationDraft,
  getActiveUiTemplate,
  getUiCustomizationDraft,
} from "../../../api/uiCustomization/uiCustomizationAPI";

export default function useUiCustomization() {
  const [draft, setDraft] = useState(null);
  const [activeTemplate, setActiveTemplate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState("");

  async function createDraft(message, page = "dashboard") {
    try {
      setLoading(true);
      setError("");

      const result = await createUiCustomizationDraft({
        message,
        page,
      });

      setDraft(result);
      return result;
    } catch (err) {
      console.error("Failed to create UI customization draft:", err);
      setError(getErrorMessage(err));
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function fetchDraft(draftId) {
    try {
      setLoading(true);
      setError("");

      const result = await getUiCustomizationDraft(draftId);
      setDraft(result);
      return result;
    } catch (err) {
      console.error("Failed to fetch UI customization draft:", err);
      setError(getErrorMessage(err));
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function applyDraft(draftId) {
    try {
      setApplying(true);
      setError("");

      const result = await applyUiCustomizationDraft(draftId);
      setActiveTemplate(result);
      return result;
    } catch (err) {
      console.error("Failed to apply UI customization draft:", err);
      setError(getErrorMessage(err));
      return null;
    } finally {
      setApplying(false);
    }
  }

  async function fetchActiveTemplate(page = "dashboard") {
    try {
      setLoading(true);
      setError("");

      const result = await getActiveUiTemplate(page);
      setActiveTemplate(result);
      return result;
    } catch (err) {
      if (err.response?.status === 404) {
        setActiveTemplate(null);
        return null;
      }

      console.error("Failed to fetch active UI template:", err);
      setError(getErrorMessage(err));
      return null;
    } finally {
      setLoading(false);
    }
  }

  return {
    draft,
    activeTemplate,
    loading,
    applying,
    error,
    createDraft,
    fetchDraft,
    applyDraft,
    fetchActiveTemplate,
  };
}

function getErrorMessage(error) {
  const detail = error.response?.data?.detail;

  if (typeof detail === "string") {
    return detail;
  }

  if (detail?.message) {
    return detail.message;
  }

  return "Something went wrong. Please try again.";
}