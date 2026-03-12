import React, { useState, useEffect } from 'react';
import './Loader.css';

const Loader = () => {
  const [show, setShow] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Start fading out after 2 seconds
    const fadeTimer = setTimeout(() => {
      setFading(true);
    }, 2000);

    // Completely remove from DOM after fade animation (0.8s)
    const removeTimer = setTimeout(() => {
      setShow(false);
    }, 2800);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!show) return null;

  return (
    <div className={`loader-overlay ${fading ? 'fade-out' : ''}`}>
      <div className="loader-content">
        <div className="loader-visual">
          {/* Circular ring */}
          <div className="loader-ring"></div>
          
          {/* Heartbeat / ECG line */}
          <svg className="ecg-svg" viewBox="0 0 100 100">
            <path 
              className="ecg-path" 
              d="M0,50 L20,50 L25,40 L35,60 L40,50 L50,50 L55,20 L65,80 L70,50 L100,50" 
            />
          </svg>

          {/* Central Medical Cross */}
          <div className="center-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M2 12h20" />
            </svg>
          </div>
        </div>
        
        <div className="loader-text">
          <span className="pulse-text">Loading Healthcare AI</span>
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
