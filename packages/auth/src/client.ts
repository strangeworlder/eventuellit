const AUTH_TOKEN_KEY = "auth_token";

const getApiBaseUrl = (): string => {
  if (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL.replace(/\/$/, "");
  }
  return "http://localhost:3000";
};

export class ApiError extends Error {
  public status: number;
  public body?: unknown;

  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

function getAuthHeaders(includeContentType = true): Record<string, string> {
  const headers: Record<string, string> = {};
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (includeContentType) headers["Content-Type"] = "application/json";
  return headers;
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${getApiBaseUrl()}${path}`;
  const response = await fetch(url, {
    ...options,
    credentials: "include",
    headers: { ...getAuthHeaders(), ...options.headers },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const msg =
      (body as { message?: string }).message || `Request failed: ${response.status}`;
    throw new ApiError(msg, response.status, body);
  }
  const text = await response.text();
  return text ? JSON.parse(text) : (undefined as T);
}

export async function apiUpload<T>(
  path: string,
  formData: FormData,
): Promise<T> {
  const url = `${getApiBaseUrl()}${path}`;
  const response = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: getAuthHeaders(false),
    body: formData,
  });
  if (!response.ok) {
    const text = await response.text();
    throw new ApiError(text || "Upload failed", response.status);
  }
  return response.json();
}
