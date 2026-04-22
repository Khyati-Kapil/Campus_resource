import { Request, Response } from "express";
import { ResourceService } from "../services/resource.service.js";
import { ok } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

const resourceService = new ResourceService();

export const listResources = asyncHandler(async (req: Request, res: Response) => {
  const result = await resourceService.list(req.query);
  return res.json(ok(result));
});

export const createResource = asyncHandler(async (req: Request, res: Response) => {
  const result = await resourceService.create(req.body);
  return res.status(201).json(ok(result));
});
