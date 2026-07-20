import Room from "../models/Room.js";
import Session from "../models/Session.js";

// Generate a unique 6-character room code
const generateRoomCode = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// @route POST /api/rooms
export const createRoom = async (req, res) => {
  const { topic } = req.body;

  try {
    let code = generateRoomCode();

    // Make sure code is unique
    let existingRoom = await Room.findOne({ code });
    while (existingRoom) {
      code = generateRoomCode();
      existingRoom = await Room.findOne({ code });
    }

    const room = await Room.create({
      topic,
      code,
      createdBy: req.user._id,
      members: [req.user._id]
    });

    // Create an empty session for this room
    await Session.create({ room: room._id, messages: [] });

    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route POST /api/rooms/join
export const joinRoom = async (req, res) => {
  const { code } = req.body;

  try {
    const room = await Room.findOne({ code: code.toUpperCase() });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Add user to members if not already there
    if (!room.members.includes(req.user._id)) {
      room.members.push(req.user._id);
      await room.save();
    }

    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/rooms/my
export const getMyRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ members: req.user._id })
      .populate("createdBy", "name")
      .sort({ createdAt: -1 });

    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/rooms/:code
export const getRoomByCode = async (req, res) => {
  try {
    const room = await Room.findOne({ code: req.params.code })
      .populate("createdBy", "name")
      .populate("members", "name");

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};