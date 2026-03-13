import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Stethoscope, 
  Send, 
  AlertCircle, 
  Info, 
  Activity,
  Loader2,
  ChevronRight
} from 'lucide-react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import './SymptomAnalyzer.css';
import { useNavigate } from 'react-router-dom';

const SymptomAnalyzer = () => {
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post('http://localhost:5000/api/symptom-analysing', {
        symptoms: symptoms
      });
      setResult(response.data);
    } catch (err) {
      console.error("Analysis error:", err);
      setError("Failed to analyze symptoms. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatAnalysis = (text) => {
    if (!text) return null;
    // Replace markdown-style bold with <strong> tags or split into lines
    return text.split('\n').map((line, index) => (
      <p key={index} className={line.startsWith('#') ? 'analysis-heading' : 'analysis-line'}>
        {line.replace(/\*\*/g, '')}
      </p>
    ));
  };

  return (
    <div className="symptom-analyzer-container">
      {/* Header */}
      <header className="analyzer-header">
        <div className="header-content">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            <ArrowLeft size={20} />
          </button>
          <div className="header-title">
            <Stethoscope size={24} className="blue-icon" />
            <h1>Symptom Analyzer</h1>
          </div>
        </div>
        <div className="header-brand">
          <span>Healify</span>
          <Activity size={20} color="#2563eb" />
        </div>
      </header>

      <main className="analyzer-main">
        <div className="analyzer-wrapper">
          {/* Input Section */}
          <section className="input-section">
            <div className="section-card">
              <h2>Describe how you feel</h2>
              <p className="subtitle">Please provide as much detail as possible about your symptoms, when they started, and their severity.</p>
              
              <form onSubmit={handleAnalyze}>
                <textarea
                  className="symptom-textarea"
                  placeholder="Example: I've had a dull headache for 2 days, sharp pain in my lower back, and I've been feeling slightly nauseous since this morning..."
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  disabled={loading}
                />
                
                <button 
                  type="submit" 
                  className={`analyze-btn ${loading ? 'loading' : ''}`}
                  disabled={loading || !symptoms.trim()}
                >
                  {loading ? (
                    <>
                      <Loader2 className="spinner" size={18} />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      <span>Analyze Symptoms</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <Info size={20} />
              </div>
              <div className="info-text">
                <h3>Tips for better results</h3>
                <ul>
                  <li>Mention the duration of each symptom</li>
                  <li>Describe the type of pain (sharp, dull, throbbing)</li>
                  <li>List any medications you've already taken</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Result Section */}
          <section className="result-section">
            {loading && (
              <div className="loading-state">
                <div className="pulse-loader">
                  <Activity size={48} className="pulse-icon" />
                </div>
                <h3>Performing Triage</h3>
                <p>Healify AI is analyzing your symptoms against medical databases...</p>
              </div>
            )}

            {error && (
              <div className="error-state">
                <AlertCircle size={40} color="#ef4444" />
                <h3>Analysis Error</h3>
                <p>{error}</p>
              </div>
            )}

            {result && (
              <div className="analysis-result-card">
                <div className="result-header">
                  <div className="status-badge">AI Analysis Complete</div>
                  <h3>Analysis Report</h3>
                </div>
                
                <div className="analysis-content">
                  <ReactMarkdown>{result.analysis}</ReactMarkdown>
                </div>

                <div className="disclaimer-box">
                  <AlertCircle size={18} />
                  <p>{result.disclaimer}</p>
                </div>

                <div className="next-steps">
                  <h4>Recommended Next Steps</h4>
                  <div className="step-options">
                    <button className="step-btn" onClick={() => navigate('/dashboard')}>
                      <span>Book an Appointment</span>
                      <ChevronRight size={16} />
                    </button>
                    <button className="step-btn" onClick={() => navigate('/medical-advice', { state: { initialContext: result.analysis } })}>
                      <span>Get AI Medical Advice</span>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {!result && !loading && !error && (
              <div className="empty-state">
                <Stethoscope size={64} className="faded-icon" />
                <h3>Your Analysis Result</h3>
                <p>Fill in your symptoms and click analyze to see common causes and recommendations.</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default SymptomAnalyzer;
