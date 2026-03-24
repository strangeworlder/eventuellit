import type { AuthUser } from "./types";

const getApiBaseUrl = (): string => {
  // Vite env vars are available via import.meta.env
  if (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL.replace(/\/$/, "");
  }
  return "http://localhost:3000";
};

export async function requestMagicLink(email: string): Promise<void> {
  const response = await fetch(`${getApiBaseUrl()}/auth/request-link`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw new Error("Failed to request magic link");
  }
}

export async function verifyToken(token: string): Promise<AuthUser> {
  const response = await fetch(`${getApiBaseUrl()}/auth/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ token }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Token verification failed" }));
    throw new Error(error.message || "Token verification failed");
  }

  const data = await response.json();
  if (data.token) {
    localStorage.setItem("auth_token", data.token);
  }
  return data.user;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const token = localStorage.getItem("auth_token");
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${getApiBaseUrl()}/auth/me`, {
    method: "GET",
    headers,
    credentials: "include",
  });

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to get current user");
  }

  return response.json();
}

export async function logout(): Promise<void> {
  const token = localStorage.getItem("auth_token");
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${getApiBaseUrl()}/auth/logout`, {
    method: "POST",
    headers,
    credentials: "include",
  });

  localStorage.removeItem("auth_token");

  if (!response.ok) {
    throw new Error("Failed to logout");
  }
}

export async function exportMyData(): Promise<unknown> {
  const token = localStorage.getItem("auth_token");
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${getApiBaseUrl()}/auth/my-data`, {
    method: "GET",
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to export data");
  }

  return response.json();
}

export async function deleteMyAccount(): Promise<void> {
  const token = localStorage.getItem("auth_token");
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${getApiBaseUrl()}/auth/my-account`, {
    method: "DELETE",
    headers,
    credentials: "include",
  });

  localStorage.removeItem("auth_token");

  if (!response.ok) {
    throw new Error("Failed to delete account");
  }
}

