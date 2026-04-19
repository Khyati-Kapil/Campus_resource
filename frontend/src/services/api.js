const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:4000/api";
export const getAuthHeaders = (token) => {
    const headers = { "Content-Type": "application/json" };
    if (token)
        headers.Authorization = `Bearer ${token}`;
    return headers;
};
export const apiRequest = async (path, init) => {
    const response = await fetch(`${API_BASE}${path}`, init);
    if (path.startsWith("/audit") &&
        init?.headers &&
        String(init.headers.Accept || "").includes("text/csv")) {
        if (!response.ok)
            throw new Error(`Request failed (${response.status})`);
        return (await response.text());
    }
    const body = (await response.json());
    if (!response.ok || !body.success) {
        throw new Error(body.error?.message ?? `Request failed (${response.status})`);
    }
    if (typeof body.data === "undefined") {
        throw new Error("Missing response data");
    }
    return body.data;
};
