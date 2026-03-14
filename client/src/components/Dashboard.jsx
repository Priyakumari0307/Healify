import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Stethoscope, 
  HeartPulse, 
  CalendarDays, 
  Scale, 
  Lightbulb, 
  FileUp,
  Search,
  Settings,
  Bell,
  User,
  LogOut,
  ChevronRight,
  Heart,
  MessageSquare,
  PlusCircle,
  Activity,
  Loader2
} from 'lucide-react';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc]">
        <Loader2 className="animate-spin text-[#2563eb]" size={40} />
        <p className="mt-4 text-gray-600 font-medium">Loading your health dashboard...</p>
      </div>
    );
  }

  if (!user) return null;

  const handleLogout = () => {
    logout();
    alert('User logged out successfully!');
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Symptom Analyzer', icon: Stethoscope, path: '/symptom-analyzer' },
    { name: 'AI Medical Advice', icon: HeartPulse, path: '/medical-advice' },
    { name: 'Book Appointment', icon: CalendarDays, path: '/appointments' },
    { name: 'Price Comparison', icon: Scale, path: '/price-comparison' },
    { name: 'Health Tips', icon: Lightbulb, path: '/health-tips' },
    { name: 'Read Prescription', icon: FileUp, path: '/read-prescription' },
  ];

  const cards = [
    {
      title: 'Symptom Analyzer',
      description: 'Get a list of possible conditions based on your symptoms.',
      icon: Stethoscope,
      color: '#eff6ff',
      iconColor: '#2563eb',
      link: 'Go to Symptom Analyzer',
      path: '/symptom-analyzer'
    },
    {
      title: 'AI Medical Advice',
      description: 'Ask for medical advice and get instant AI-powered suggestions.',
      icon: HeartPulse,
      color: '#eff6ff',
      iconColor: '#2563eb',
      link: 'Go to AI Medical Advice',
      path: '/medical-advice'
    },
    {
      title: 'Book Appointment',
      description: 'Schedule your next visit with a healthcare professional easily.',
      icon: CalendarDays,
      color: '#eff6ff',
      iconColor: '#2563eb',
      link: 'Go to Book Appointment',
      path: '/appointments'
    },
    {
      title: 'Price Comparison',
      description: 'Compare medicine prices from various online pharmacies.',
      icon: Scale,
      color: '#eff6ff',
      iconColor: '#2563eb',
      link: 'Go to Price Comparison',
      path: '/price-comparison'
    },
    {
      title: 'Health Tips',
      description: 'Get daily tips and reminders to stay healthy and fit.',
      icon: Lightbulb,
      color: '#eff6ff',
      iconColor: '#2563eb',
      link: 'Go to Health Tips',
      path: '/health-tips'
    },
    {
      title: 'Read Prescription',
      description: 'Upload a picture of your prescription to digitize it.',
      icon: FileUp,
      color: '#eff6ff',
      iconColor: '#2563eb',
      link: 'Go to Read Prescription',
      path: '/read-prescription'
    }
  ];

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <Activity className="heart-icon-fill" color="#2563eb" size={24} />
          <span className="logo-text">Healify</span>
        </div>
        
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <div 
              key={item.name}
              className={`nav-item ${activeTab === item.name ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(item.name);
                navigate(item.path);
              }}
            >
              <item.icon size={20} className="nav-icon" />
              <span>{item.name}</span>
            </div>
          ))}
        </nav>

        <div className="sidebar-footer-auth">
          <div className="user-info-badge">
            <div className="user-avatar-small">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="user-details-small">
              <span className="user-name-small">{user.name}</span>
              <span className="user-email-small">{user.email}</span>
            </div>
          </div>
          <button className="sidebar-logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <header className="main-header">
          <div className="header-left">
            <LayoutDashboard size={20} className="header-icon" />
            <h1>Dashboard</h1>
          </div>
          <div className="header-right">
            <span className="header-brand">Healify</span>
            <Activity className="heart-icon-fill" color="#2563eb" size={20} />
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="dashboard-body">
          {/* Welcome Banner */}
          <section className="welcome-banner">
            <div className="welcome-text">
              <h2>Welcome to Healify, {user.name}!</h2>
              <p>Your friendly AI health assistant. Here to help you make informed health decisions.</p>
              <p className="sub-text">Select one of the options below to get started.</p>
            </div>
          </section>

          {/* Cards Grid */}
          <div className="cards-grid">
            {cards.map((card, index) => (
              <div 
                key={index} 
                className="action-card"
                onClick={() => navigate(card.path)}
              >
                <div className="card-header">
                  <h3 className="card-title">{card.title}</h3>
                  <div className="card-icon-wrapper" style={{ backgroundColor: card.color }}>
                    <card.icon size={24} color={card.iconColor} />
                  </div>
                </div>
                <p className="card-description">{card.description}</p>
                <div className="card-footer">
                  <span className="card-link">{card.link}</span>
                  <ChevronRight size={18} className="arrow-icon" />
                </div>
              </div>
            ))}
          </div>
        </div>


      </main>
    </div>
  );
};

export default Dashboard;
