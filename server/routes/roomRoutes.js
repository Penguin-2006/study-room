import express from "express";
import {
  createRoom,
  joinRoom,
  getMyRooms,
  getRoomByCode
} from "../controllers/roomController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createRoom);
router.post("/join", protect, joinRoom);
router.get("/my", protect, getMyRooms);
router.get("/:code", protect, getRoomByCode);

export default router;