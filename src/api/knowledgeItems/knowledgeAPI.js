import apiClient from "../apiClient";

export async function getKnowledgeItems() {
    const response = await apiClient.get("/api/knowledge-items");
    return response.data;
}

export async function getKnowledgeItemById(id) {
    const response = await apiClient.get(`/api/knowledge-items/${id}`);
    return response.data;
}

export async function createKnowledgeItem(itemData) {
    const response = await apiClient.post("/api/knowledge-items", itemData);
    return response.data;
}

export async function updateKnowledgeItem(id, payload) {
  const response = await apiClient.put(`/api/knowledge-items/${id}`, payload);
  return response.data;
}

export async function deleteKnowledgeItem(id) {
  await apiClient.delete(`/api/knowledge-items/${id}`);
}