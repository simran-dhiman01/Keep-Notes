import express from "express";
import { upgradePlan } from "../controllers/tenantController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import {isAdmin} from "../middleware/isAdmin.js";

const router = express.Router();

router.post("/:slug/upgrade", isAuthenticated, isAdmin ,  upgradePlan);

export default router;