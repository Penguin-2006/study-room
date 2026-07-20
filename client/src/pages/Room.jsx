import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "../utils/axios";
import socket from "../utils/socket";

const Room = () => {
  const { code } = useParams();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [aiTyping, setAiTyping] = useState(false);
  const [toast, setToast] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const { data } = await axios.get(`/rooms/${code}`);
        setRoom(data);
      } catch (error) {
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();

    // Connect socket and join room
    socket.connect();
    socket.emit("join-room", { roomCode: code, token: user.token });

    // Receive session history
    socket.on("session-history", (history) => {
      setMessages(history);
    });

    // Receive new messages
    socket.on("new-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
      if (msg.type === "ai") setAiTyping(false);
    });

    // User joined notification
    socket.on("user-joined", ({ name }) => {
      setMessages((prev) => [...prev, {
        type: "notification",
        content: `${name} joined the room`
      }]);
    });

    // User left notification
    socket.on("user-left", ({ name }) => {
      setMessages((prev) => [...prev, {
        type: "notification",
        content: `${name} left the room`
      }]);
    });

    // Cleanup on unmount
    return () => {
      socket.off("session-history");
      socket.off("new-message");
      socket.off("user-joined");
      socket.off("user-left");
      socket.disconnect();
    };
  }, [code]);

  const handleSend = () => {
    if (!message.trim()) return;
    setAiTyping(true);
    socket.emit("send-message", { roomCode: code, message });
    setMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setToast(true);
    setTimeout(() => setToast(false), 2000);
  };

  if (loading) return <div className="empty-state">Loading room...</div>;

  return (
    <div className="room-container">
      {/* Header */}
      <div className="room-header">
        <div>
          <h1 className="room-title">{room?.topic}</h1>
          <p style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "4px" }}>
            {room?.members?.length} member{room?.members?.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            onClick={handleCopyCode}
            className="room-code-badge"
            title="Click to copy room code"
          >
            📋 {code}
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="btn-danger"
          >
            Leave
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="messages-container">
        {messages.length === 0 && (
          <div className="empty-state">
            No messages yet. Ask the AI anything about {room?.topic}!
          </div>
        )}

        {messages.map((msg, index) => {
          if (msg.type === "notification") {
            return (
              <div key={index} className="notification">
                {msg.content}
              </div>
            );
          }

          return (
            <div key={index} className={`message ${msg.type}`}>
              <span className="message-sender">
                {msg.type === "ai" ? "🤖 AI Assistant" : `👤 ${msg.sender}`}
              </span>
              <div className="message-bubble">
                {msg.content}
              </div>
            </div>
          );
        })}

        {aiTyping && (
          <div className="message ai">
            <span className="message-sender">🤖 AI Assistant</span>
            <div className="message-bubble" style={{ color: "#9ca3af" }}>
              Thinking...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="message-input-area">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="message-input"
          placeholder="Ask anything... (Enter to send, Shift+Enter for new line)"
          rows={2}
        />
        <button
          onClick={handleSend}
          disabled={!message.trim() || aiTyping}
          className="btn-primary"
          style={{ opacity: !message.trim() || aiTyping ? 0.5 : 1 }}
        >
          Send
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div className="copy-toast">
          ✅ Room code copied!
        </div>
      )}
    </div>
  );
};

export default Room;