import React, { useState, useEffect } from 'react';
import { FileUp, Activity, ArrowLeft, Loader2, AlertCircle, CheckCircle2, Pill, Calendar, Clock, History, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PrescriptionReader.css';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config';

const PrescriptionReader = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const navigate = useNavigate();
  const { user, token } = useAuth();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/prescription/history`);
      setHistory(res.data);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post(`${API_BASE_URL}/api/prescription`, formData);
      setResult(res.data);
      fetchHistory(); // Refresh history after new scan
    } catch (err) {
      console.error("Prescription upload error:", err);
      alert("Failed to analyze prescription. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const viewHistoryItem = (item) => {
    try {
      const parsedAnalysis = JSON.parse(item.analysis);
      setResult(parsedAnalysis);
      setShowHistory(false);
    } catch (e) {
      console.error("Error parsing history item:", e);
    }
  };

  return (
    <div className="prescription-reader-container">
      <header className="reader-header">
        <div className="header-left-side">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            <ArrowLeft size={20} />
          </button>
          <h1>Scan Prescription</h1>
        </div>
        <div className="header-right-side">
          <button className={`history-toggle-btn ${showHistory ? 'active' : ''}`} onClick={() => setShowHistory(!showHistory)}>
            <History size={20} />
            <span>History ({history.length})</span>
          </button>
          <div className="header-divider"></div>
          <div className="header-brand">
            <span>Healify</span>
            <Activity size={20} color="#2563eb" />
          </div>
        </div>
      </header>

      <main className="reader-main-layout">
        <div className={`reader-content-area ${showHistory ? 'with-sidebar' : ''}`}>
          {!result ? (
            <div className="upload-section">
              <div className="upload-card">
                <div className="drop-zone">
                  {preview ? (
                    <img src={preview} alt="Prescription Preview" className="preview-img" />
                  ) : (
                    <>
                      <FileUp size={48} className="upload-icon" />
                      <p>Drag and drop or click to upload prescription</p>
                      <span>Supports JPG, PNG (Max 5MB)</span>
                    </>
                  )}
                  <input type="file" accept="image/*" onChange={handleFileChange} />
                </div>
                
                <button 
                  className="analyze-btn" 
                  disabled={!file || loading}
                  onClick={handleUpload}
                >
                  {loading ? <Loader2 className="spinner" size={20} /> : "Digitize Prescription"}
                </button>
              </div>
            </div>
          ) : (
            <div className="result-section">
              <div className="result-grid">
                <div className="analysis-card">
                  <div className="card-header">
                    <CheckCircle2 color="#059669" size={24} />
                    <h3>Digitized Details</h3>
                  </div>
                  
                  <div className="meds-list">
                    {result.medications?.map((med, idx) => (
                      <div key={idx} className="med-item">
                        <div className="med-header">
                          <Pill size={18} color="#2563eb" />
                          <h4>{med.medicine_name || med.name}</h4>
                        </div>
                        <div className="med-details">
                          <p><strong>Dosage:</strong> {med.dosage}</p>
                          <p><strong>Frequency:</strong> {med.frequency}</p>
                          <p><strong>Instructions:</strong> {med.special_instructions || med.instructions}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="summary-section">
                    <h4>AI Summary</h4>
                    <p>{result.patient_friendly_summary}</p>
                  </div>
                </div>

                <div className="timeline-card">
                  <div className="card-header">
                    <Calendar color="#2563eb" size={24} />
                    <h3>Dosage Schedule</h3>
                  </div>
                  <div className="timeline">
                    {result.medication_timeline?.map((item, idx) => (
                      <div key={idx} className="timeline-item">
                        <div className="time">{item.schedule || item.time}</div>
                        <div className="med-names">{item.medicine || (item.meds && item.meds.join(', '))}</div>
                      </div>
                    ))}
                  </div>
                  <div className="result-actions">
                    <button className="reminder-btn">Set Reminders</button>
                    <button className="reset-btn" onClick={() => {
                      setResult(null);
                      setFile(null);
                      setPreview(null);
                    }}>Scan Another</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Prescription History Sidebar */}
        <aside className={`prescription-sidebar ${showHistory ? 'open' : ''}`}>
          <div className="sidebar-header">
            <h3>Scan History</h3>
            <button className="close-sidebar" onClick={() => setShowHistory(false)}>
              <ChevronRight size={20} />
            </button>
          </div>
          <div className="history-list">
            {history.length === 0 ? (
              <div className="empty-history">
                <Clock size={32} />
                <p>No previous scans found</p>
              </div>
            ) : (
              history.map((item) => (
                <div key={item._id} className="history-item-card" onClick={() => viewHistoryItem(item)}>
                  <div className="history-info">
                    <span className="file-name">{item.originalFileName}</span>
                    <span className="history-date">
                      {new Date(item.createdAt).toLocaleDateString()} at {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <ChevronRight size={16} className="history-arrow" />
                </div>
              ))
            )}
          </div>
        </aside>
      </main>
    </div>
  );
};

export default PrescriptionReader;
