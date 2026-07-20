import express from "express";
import { getSession, getMySessions } from "../controllers/sessionController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/my", protect, getMySessions);
router.get("/:roomId", protect, getSession);

export default router;