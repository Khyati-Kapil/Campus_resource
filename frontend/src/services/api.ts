import { ApiEnvelope } from "../types";

const API_BASE = (() => {
  const raw = (import.meta.env.VITE_API_BASE as string | undefined)?.trim();
  const base = raw && raw.length > 0 ? raw : "http://localhost:4000/api";
  return base.endsWith("/") ? base.slice(0, -1) : base;
})();

export const getAuthHeaders = (token: string | null) => {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
};

export const apiRequest = async <T>(
  path: string,
  init?: RequestInit
): Promise<T> => {
  const url = `${API_BASE}${path}`;
  let response: Response;
  try {
    response = await fetch(url, init);
  } catch {
    throw new Error(`Cannot reach API at ${url}. Check VITE_API_BASE and backend availability/CORS.`);
  }

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

  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
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
  }

  // If we get HTML/text back, the frontend likely hit a static route or proxy (common when API_BASE is wrong).
  const text = (await response.text()).trim();
  const preview = text.slice(0, 160).replace(/\s+/g, " ");
  throw new Error(`API returned non-JSON (${response.status}) from ${url}: ${preview || "empty response"}`);
};
