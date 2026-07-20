import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topic, setTopic] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);

  const fetchRooms = async () => {
    try {
      const { data } = await axios.get("/rooms/my");
      setRooms(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setCreating(true);
    setError("");
    try {
      const { data } = await axios.post("/rooms", { topic });
      navigate(`/room/${data.code}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create room");
    } finally {
      setCreating(false);
    }
  };

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    if (!joinCode.trim()) return;
    setJoining(true);
    setError("");
    try {
      const { data } = await axios.post("/rooms/join", { code: joinCode });
      navigate(`/room/${data.code}`);
    } catch (err) {
      setError(err.response?.data?.message || "Room not found");
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Dashboard</h1>
      <p className="page-subtitle">Welcome, {user.name}</p>

      {error && <div className="error-box">{error}</div>}

      
      <div className="dashboard-grid">
        
        <div className="card">
          <h2 className="dashboard-section-title">Create a Room</h2>
          <form onSubmit={handleCreateRoom}>
            <div className="form-group">
              <label>Study Topic</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="form-input"
                placeholder="e.g. Operating Systems Exam"
                required
              />
            </div>
            <button
              type="submit"
              disabled={creating}
              className="btn-primary"
              style={{ width: "100%" }}
            >
              {creating ? "Creating..." : "Create Room"}
            </button>
          </form>
        </div>

       
        <div className="card">
          <h2 className="dashboard-section-title">Join a Room</h2>
          <form onSubmit={handleJoinRoom}>
            <div className="form-group">
              <label>Room Code</label>
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                className="form-input"
                placeholder="e.g. ABC123"
                maxLength={6}
                required
              />
            </div>
            <button
              type="submit"
              disabled={joining}
              className="btn-primary"
              style={{ width: "100%" }}
            >
              {joining ? "Joining..." : "Join Room"}
            </button>
          </form>
        </div>
      </div>

      
      <h2 className="dashboard-section-title">My Rooms</h2>
      {loading ? (
        <div className="empty-state">Loading rooms...</div>
      ) : rooms.length === 0 ? (
        <div className="empty-state">
          No rooms yet. Create or join a room to get started.
        </div>
      ) : (
        <div>
          {rooms.map((room) => (
            <div
              key={room._id}
              className="room-card"
              onClick={() => navigate(`/room/${room.code}`)}
              style={{ cursor: "pointer" }}
            >
              <div>
                <p className="room-topic">{room.topic}</p>
                <p className="room-code">Code: {room.code}</p>
                <p className="room-meta">
                  {room.members.length} member{room.members.length !== 1 ? "s" : ""} •
                  Created {new Date(room.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span className="badge">Open →</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;