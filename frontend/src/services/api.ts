import { ApiEnvelope } from "../types";

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:4000/api";

export const getAuthHeaders = (token: string | null) => {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
};

export const apiRequest = async <T>(
  path: string,
  init?: RequestInit
): Promise<T> => {
  const response = await fetch(`${API_BASE}${path}`, init);

  if (
    path.startsWith("/audit") &&
    init?.headers &&
    String((init.headers as Record<string, string>).Accept || "").includes(
      "text/csv"
    )
  ) {
    if (!response.ok) throw new Error(`Request failed (${response.status})`);
    return (await response.text()) as T;
  }

  const body = (await response.json()) as ApiEnvelope<T>;
  if (!response.ok || !body.success) {
    throw new Error(
      body.error?.message ?? `Request failed (${response.status})`
    );
  }
  if (typeof body.data === "undefined") {
    throw new Error("Missing response data");
  }
  return body.data;
};
