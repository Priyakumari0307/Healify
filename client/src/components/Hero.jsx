import { Link } from 'react-router-dom';
import './Hero.css';
import heroBg from '../assets/hero-bg.png';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-background">
        <img src={heroBg} alt="Medical Background" className="hero-bg-img" />
        <div className="hero-overlay"></div>
      </div>



      <div className="hero-content">
        <div className="heartbeat-badge">
          <svg className="heartbeat-line-small" viewBox="0 0 100 20">
            <path d="M0 10 L10 10 L15 2 L25 18 L30 10 L40 10 L45 2 L55 18 L60 10 L100 10" />
          </svg>
          <span>AI Powered Care</span>
        </div>

        <h1 className="hero-title">
          Smart Healthcare <br />
          <span className="highlight">Solution for Better Life</span>
        </h1>

        <p className="hero-subtitle">
          Experience AI-powered health analysis and professional symptom checking at your fingertips.
          Your journey to a healthier life starts here with advanced diagnostic technology.
        </p>

        <div className="hero-actions">
          <Link to="/signup" className="btn-primary">Sign Up now</Link>
          <button className="btn-secondary">Learn More</button>
        </div>

        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-number">10k+</span>
            <span className="stat-label">Happy Patients</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">250+</span>
            <span className="stat-label">Expert Doctors</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">24/7</span>
            <span className="stat-label">AI Support</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
