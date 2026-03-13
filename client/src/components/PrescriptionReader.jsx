import React, { useState } from 'react';
import { FileUp, Activity, ArrowLeft, Loader2, AlertCircle, CheckCircle2, Pill, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PrescriptionReader.css';

const PrescriptionReader = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

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
      const res = await axios.post('http://localhost:5000/api/prescription', formData);
      setResult(res.data);
    } catch (err) {
      console.error("Prescription upload error:", err);
      alert("Failed to analyze prescription. Make sure it is a clear image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="prescription-reader-container">
      <header className="reader-header">
        <div className="header-content">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            <ArrowLeft size={20} />
          </button>
          <h1>Scan Prescription</h1>
        </div>
        <div className="header-brand">
          <span>Healify</span>
          <Activity size={20} color="#2563eb" />
        </div>
      </header>

      <main className="reader-main">
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
                <button className="reminder-btn">Set Reminders</button>
                <button className="reset-btn" onClick={() => setResult(null)}>Scan Another</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PrescriptionReader;
