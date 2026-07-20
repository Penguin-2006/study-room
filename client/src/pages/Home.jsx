import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      {/* Hero */}
      <div className="hero">
        <div className="hero-tag">AI-Powered Study Tool</div>
        <h1>Study smarter,<br /><span>together</span></h1>
        <p>
          Create a study room, share a code with friends, and get
          instant AI answers that everyone can see in real time.
        </p>
        <div className="hero-buttons">
          <Link to="/register" className="btn-accent">Get started free</Link>
          <Link to="/login" className="btn-outline">Login</Link>
        </div>
      </div>

      
        <div className="features">
        <p className="features-title">Everything you need</p>
        <div className="features-box">
            <div className="features-grid">
            <div className="feature-item">
                <p className="feature-number">01</p>
                <h3>Collaborative Rooms</h3>
                <p>Create a room and invite friends with a 6-digit code. Everyone studies together in real time.</p>
            </div>
            <div className="feature-item">
                <p className="feature-number">02</p>
                <h3>AI Study Assistant</h3>
                <p>Ask anything and get instant AI-powered answers. The AI remembers the full conversation context.</p>
            </div>
            <div className="feature-item">
                <p className="feature-number">03</p>
                <h3>Session History</h3>
                <p>Every session is automatically saved. Come back anytime to review past discussions.</p>
            </div>
            </div>
        </div>
        </div>

      
      <div className="cta">
        <h2>Ready to study smarter?</h2>
        <p>Join students using AI to ace their exams.</p>
        <Link to="/register" className="btn-primary">Create a room →</Link>
      </div>
    </div>
  );
};

export default Home;