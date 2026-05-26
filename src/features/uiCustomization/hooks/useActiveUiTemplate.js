import { useCallback, useEffect, useState } from "react";
import { getActiveUiTemplate } from "../../../api/uiCustomization/uiCustomizationAPI";

export default function useActiveUiTemplate(page = "dashboard") {
  const [activeTemplateResponse, setActiveTemplateResponse] = useState(null);
  const [loadingActiveTemplate, setLoadingActiveTemplate] = useState(true);
  const [activeTemplateError, setActiveTemplateError] = useState("");

  const loadActiveTemplate = useCallback(async () => {
    try {
      setLoadingActiveTemplate(true);
      setActiveTemplateError("");

      const result = await getActiveUiTemplate(page);
      setActiveTemplateResponse(result);

      return result;
    } catch (error) {
      if (error.response?.status === 404) {
        setActiveTemplateResponse(null);
        return null;
      }

      console.error("Failed to load active UI template:", error);
      setActiveTemplateError("Failed to load active UI template.");
      return null;
    } finally {
      setLoadingActiveTemplate(false);
    }
  }, [page]);

  useEffect(() => {
    loadActiveTemplate();
  }, [loadActiveTemplate]);

  return {
    activeTemplateResponse,
    activeTemplate: activeTemplateResponse?.template || null,
    loadingActiveTemplate,
    activeTemplateError,
    reloadActiveTemplate: loadActiveTemplate,
    setActiveTemplateResponse,
  };
}