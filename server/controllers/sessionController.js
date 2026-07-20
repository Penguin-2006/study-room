import Session from "../models/Session.js";
import Room from "../models/Room.js";

// @route GET /api/sessions/:roomId
export const getSession = async (req, res) => {
  try {
    const session = await Session.findOne({ room: req.params.roomId });

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/sessions/my
export const getMySessions = async (req, res) => {
  try {
    const rooms = await Room.find({ members: req.user._id });
    const roomIds = rooms.map((room) => room._id);

    const sessions = await Session.find({ room: { $in: roomIds } })
      .populate("room", "topic code")
      .sort({ createdAt: -1 });

    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};