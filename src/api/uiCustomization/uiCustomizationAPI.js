import apiClient from "../apiClient";

export async function createUiCustomizationDraft(payload) {
    const response = await apiClient.post("/api/ui-customization/draft", payload);
    return response.data;
}

export async function getUiCustomizationDraft(draftId) {
    const response = await apiClient.get(`/api/ui-customization/drafts/${draftId}`);
    return response.data;
}

export async function applyUiCustomizationDraft(draftId) {
    const response = await apiClient.post(`/api/ui-customization/drafts/${draftId}/apply`);
    return response.data;
}

export async function getActiveUiTemplate(page = "dashboard") {
    const response = await apiClient.get(`/api/ui-customization/pages/${page}/active`);
    return response.data;
}