import express from "express";
import { login, inviteUser, logout } from "../controllers/userController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import {isAdmin} from "../middleware/isAdmin.js";

const router = express.Router();

router.post("/login", login);
router.post("/logout",isAuthenticated ,logout);
router.post("/invite", isAuthenticated, isAdmin ,inviteUser);

export default router;