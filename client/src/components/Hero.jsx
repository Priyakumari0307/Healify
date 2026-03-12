import React from 'react';
import './Hero.css';
import heroBg from '../assets/hero-bg.png';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-background">
        <img src={heroBg} alt="Medical Background" className="hero-bg-img" />
        <div className="hero-overlay"></div>
      </div>

      {/* Floating Icons */}
      <div className="floating-icons">
        <div className="icon stethoscope">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4.8 2.3A.3.3 0 1 0 5 2a1.5 1.5 0 0 0-3 0v12a5 5 0 0 0 5 5 5 5 0 0 0 5-5V2a1.5 1.5 0 0 0-3 0 .3.3 0 1 0 .2.3" />
            <path d="M14 15a3 3 0 1 0-6 0v7h6v-7z" />
          </svg>
        </div>
        <div className="icon plus">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </div>
        <div className="icon heartbeat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
             <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        </div>
        <div className="icon medical-cross">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v20M2 12h20" />
          </svg>
        </div>
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
          <button className="btn-primary">Book Appointment</button>
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
