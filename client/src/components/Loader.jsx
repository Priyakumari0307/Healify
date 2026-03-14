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
        <div className="loader-heartbeat">
          <svg className="heartbeat-line-large" viewBox="0 0 100 20">
            <path d="M0 10 L10 10 L15 2 L25 18 L30 10 L40 10 L45 2 L55 18 L60 10 L100 10" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Loader;
