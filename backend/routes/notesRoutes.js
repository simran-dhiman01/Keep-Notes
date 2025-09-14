import express from "express";
import { createNote, getNotes, getNoteById, updateNote, deleteNote } from "../controllers/notesController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { isMember } from "../middleware/isAdmin.js";

const router = express.Router();

router.post("/", isAuthenticated,isMember , createNote);
router.get("/", isAuthenticated, getNotes);
router.get("/:id", isAuthenticated, isMember , getNoteById);
router.put("/:id", isAuthenticated, isMember , updateNote);
router.delete("/:id", isAuthenticated, isMember , deleteNote);

export default router;
