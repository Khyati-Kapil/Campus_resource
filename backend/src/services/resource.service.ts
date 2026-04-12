export class ResourceService {
  async list(query: Record<string, unknown>) {
    return { items: [], filters: query };
  }

  async create(payload: Record<string, unknown>) {
    return { id: "pending", ...payload };
  }
}
