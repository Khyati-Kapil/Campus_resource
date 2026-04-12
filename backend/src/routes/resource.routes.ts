import { Router } from "express";
import { createResource, listResources } from "../controllers/resource.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/rbac.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";
import { createResourceSchema } from "../models/dto/resource.dto.js";

const router = Router();

router.get("/", requireAuth, listResources);
router.post("/", requireAuth, requireRole("ADMIN"), validate(createResourceSchema), createResource);

export default router;
