import axios from "axios";

const apiClient = axios.create({
  baseURL: "/api",
});

const extractErrorMessage = (error) => {
  if (error.response?.data?.detail) {
    return Array.isArray(error.response.data.detail)
      ? error.response.data.detail.map((item) => item.msg || item).join(", ")
      : error.response.data.detail;
  }
  return error.message || "Unexpected error";
};

export const fetchSubscriptions = async () => {
  const response = await apiClient.get("/subscriptions/");
  return response.data;
};

export const createSubscription = async (payload) => {
  const response = await apiClient.post("/subscriptions/", payload);
  return response.data;
};

export const updateSubscription = async (id, payload) => {
  const response = await apiClient.put(`/subscriptions/${id}`, payload);
  return response.data;
};

export const deleteSubscription = async (id) => {
  await apiClient.delete(`/subscriptions/${id}`);
};

export const updateSubscriptionStatus = async (id, status) => {
  const response = await apiClient.patch(`/subscriptions/${id}/status`, { status });
  return response.data;
};

export const fetchAnalytics = async () => {
  const response = await apiClient.get("/analytics/summary");
  return response.data;
};

export { extractErrorMessage };

export default apiClient;
