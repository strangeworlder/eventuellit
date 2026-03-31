const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export const apiBaseUrl = configuredApiBaseUrl.replace(/\/$/, "");

export const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem("auth_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};
