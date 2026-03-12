import React, { useEffect, useRef } from 'react';
import './About.css';

const About = () => {
  const cards = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2v20M2 12h20M12 2L2 12l10 10 10-10L12 2z" />
        </svg>
      ),
      title: "AI Diagnostics",
      description: "Our advanced neural networks analyze symptoms with 99% accuracy, providing instant health insights."
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
      title: "Secure & Private",
      description: "Enterprise-grade encryption ensures your medical data remains completely anonymous and protected."
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      ),
      title: "24/7 Assistance",
      description: "Whether it's 3 AM or mid-afternoon, our digital health assistants are always ready to help you."
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="8.5" cy="7" r="4" />
          <polyline points="17 11 19 13 23 9" />
        </svg>
      ),
      title: "Expert Network",
      description: "Instantly connect with over 500+ board-certified specialists across 30+ medical disciplines."
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.about-card, .about-header');
    elements.forEach((el) => observer.observe(el));

    const handleMouseMove = (e) => {
      const cards = document.querySelectorAll('.about-card');
      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--x', `${x}px`);
        card.style.setProperty('--y', `${y}px`);
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      observer.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <section className="about-section" id="about">
      <div className="about-container">
        <div className="about-header">
          <span className="about-badge">Our Mission</span>
          <h2 className="about-title">Revolutionizing Healthcare Through <span className="text-gradient">Intelligence</span></h2>
          <p className="about-subtitle">
            We combine artificial intelligence with human expertise to make quality healthcare accessible, 
            affordable, and instant for everyone on the planet.
          </p>
        </div>

        <div className="about-grid">
          {cards.map((card, index) => (
            <div className="about-card" key={index} style={{ transitionDelay: `${index * 0.15}s` }}>
              <div className="card-inner">
                <div className="card-icon-wrapper">
                  {card.icon}
                </div>
                <h3 className="card-title">{card.title}</h3>
                <p className="card-description">{card.description}</p>
                <div className="card-footer">
                  <span className="learn-more">Read More 
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="arrow-icon">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
              <div className="card-glow"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
