export const API_BASE_URL = "http://localhost:5050/api";

export async function apiRequest(path, { method = "GET", body, headers = {} } = {}) {
  const requestHeaders = new Headers(headers);
  const hasBody = body !== undefined && body !== null;

  if (hasBody && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }

  if (!requestHeaders.has("Accept")) {
    requestHeaders.set("Accept", "application/json");
  }

  const token =
    typeof window !== "undefined" ? window.localStorage.getItem("token") : null;

  if (token) {
    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const response = await fetch(`${API_BASE_URL}${normalizedPath}`, {
    method,
    headers: requestHeaders,
    ...(hasBody ? { body: JSON.stringify(body) } : {}),
  });

  const responseText = await response.text();
  let responseData = null;

  if (responseText) {
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = responseText;
    }
  }

  if (!response.ok) {
    const backendMessage =
      responseData && typeof responseData === "object"
        ? responseData.message
        : null;
    const message =
      typeof backendMessage === "string" && backendMessage.trim()
        ? backendMessage
        : `Request failed with status ${response.status}`;

    throw new Error(message);
  }

  return responseData;
}

export const get = (path, options = {}) =>
  apiRequest(path, { ...options, method: "GET" });

export const post = (path, body, options = {}) =>
  apiRequest(path, { ...options, method: "POST", body });

export const put = (path, body, options = {}) =>
  apiRequest(path, { ...options, method: "PUT", body });

export const del = (path, options = {}) =>
  apiRequest(path, { ...options, method: "DELETE" });

export const api = { request: apiRequest, get, post, put, delete: del };
