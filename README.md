# StudyRoom - Collaborative AI Study Rooms

A real-time collaborative study room app built with the MERN stack and Socket.io. Students create rooms, invite friends via a 6-digit code, and get AI-powered answers that everyone in the room sees instantly.

## Live Demo

- Frontend: https://your-app.vercel.app
- Backend: https://your-app.onrender.com

> Note: The backend is hosted on Render's free tier and may take 30-60 seconds to wake up on the first request if it has been inactive.

## Features

- Create study rooms with a unique 6-digit shareable code
- Real-time messaging — everyone in the room sees messages instantly
- AI study assistant powered by Groq (llama-3.3-70b-versatile) with full conversation memory
- Session history saved to MongoDB — revisit past study sessions anytime
- JWT authentication with protected routes
- Mobile responsive UI

## Tech Stack

### Frontend
- React.js (Vite)
- Redux Toolkit (state management)
- React Router v6 (routing)
- Socket.io-client (real-time communication)
- Axios (API calls)
- Plain CSS

### Backend
- Node.js
- Express.js
- Socket.io (WebSocket server)
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs (password hashing)
- Groq SDK (AI integration)

## Getting Started

### Prerequisites
- Node.js
- MongoDB Atlas account
- Groq API key (free at console.groq.com)

### Installation

1. Clone the repository

```
git clone https://github.com/yourusername/study-room.git
cd study-room
```

2. Set up the server

```
cd server
npm install
```

3. Create a .env file in the server folder

```
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
```

4. Start the backend

```
npm run dev
```

5. Set up the client

```
cd ../client
npm install
npm run dev
```

6. Open http://localhost:5173 in your browser

## Project Structure

```
study-room/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Navbar, ProtectedRoute
│   │   ├── pages/          # Home, Login, Register, Dashboard, Room
│   │   ├── redux/          # Auth slice and store
│   │   └── utils/          # Axios instance, Socket.io client
├── server/                 # Express backend
│   ├── config/             # Database connection
│   ├── controllers/        # Route handlers
│   ├── middleware/         # Auth middleware
│   ├── models/             # User, Room, Session schemas
│   └── routes/             # API routes
```

## API Endpoints

### Auth
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login
- GET /api/auth/me - Get current user

### Rooms
- POST /api/rooms - Create a room
- POST /api/rooms/join - Join a room by code
- GET /api/rooms/my - Get my rooms
- GET /api/rooms/:code - Get room by code

### Sessions
- GET /api/sessions/my - Get my sessions
- GET /api/sessions/:roomId - Get session for a room

## Socket.io Events

### Client to Server
- join-room - Join a study room
- send-message - Send a message to the room

### Server to Client
- session-history - Receive past messages on join
- new-message - Receive a new message or AI response
- user-joined - Notification when a user joins
- user-left - Notification when a user leaves
