import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Stethoscope, 
  Send, 
  AlertCircle, 
  Info, 
  Activity,
  Loader2,
  ChevronRight,
  ChevronDown,
  Brain,
  Search,
  TestTubes,
  Shield,
  Building,
  Siren
} from 'lucide-react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import './SymptomAnalyzer.css';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

const parseAnalysisResult = (markdown) => {
  const sections = [];
  const lines = markdown.split('\n');
  let currentSection = null;
  let fallbackText = [];

  for (let line of lines) {
    // Check if line is a top-level heading
    if (line.match(/^#\s/)) {
      if (currentSection) {
        currentSection.content = currentSection.content.join('\n').trim();
        sections.push(currentSection);
      }
      currentSection = {
        title: line.replace(/^#\s/, '').trim(),
        content: []
      };
    } else if (currentSection) {
      currentSection.content.push(line);
    } else {
      fallbackText.push(line);
    }
  }
  
  if (currentSection) {
    currentSection.content = currentSection.content.join('\n').trim();
    sections.push(currentSection);
  }

  if (sections.length === 0 && fallbackText.length > 0) {
    sections.push({ title: "Analysis Result", content: fallbackText.join('\n').trim() });
  }

  return sections;
};

const CollapsibleSection = ({ title, content, isOpen: defaultOpen }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  let Icon = Activity;
  if (title.toLowerCase().includes('summary')) Icon = Brain;
  else if (title.toLowerCase().includes('symptom')) Icon = Search;
  else if (title.toLowerCase().includes('differential')) Icon = TestTubes;
  else if (title.toLowerCase().includes('care')) Icon = Shield;
  else if (title.toLowerCase().includes('roadmap')) Icon = Building;
  else if (title.toLowerCase().includes('emergency') || title.toLowerCase().includes('warning')) Icon = Siren;

  const isSummary = title.toLowerCase().includes('summary');

  if (isSummary) {
    return (
      <div className="report-section summary-section">
        <div className="section-header always-open">
          <div className="header-title-group">
            {title.includes('✅') ? null : <Icon size={20} className="section-icon" />}
            <h4>{title} {title.includes('✅') ? '' : '✅'}</h4>
          </div>
        </div>
        <div className="section-body">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    );
  }

  return (
    <div className={`report-section ${isOpen ? 'open' : ''}`}>
      <div className="section-header" onClick={() => setIsOpen(!isOpen)}>
        <div className="header-title-group">
          <Icon size={20} className="section-icon" />
          <h4>{title}</h4>
        </div>
        {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
      </div>
      {isOpen && (
        <div className="section-body">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      )}
    </div>
  );
};

const SymptomAnalyzer = () => {
  const [symptoms, setSymptoms] = useState('');
  const [phase, setPhase] = useState('input'); // input, loading_questions, interview, analyzing, result
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [interviewAnswers, setInterviewAnswers] = useState([]);
  
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleStartAnalysis = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    setPhase('loading_questions');
    setError(null);
    setResult(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/symptom-analysing/questions`, { symptoms });
      if (response.data.questions && response.data.questions.length > 0) {
        setQuestions(response.data.questions);
        setCurrentQuestionIdx(0);
        setInterviewAnswers([]);
        setPhase('interview');
      } else {
        submitFinalAnalysis([]);
      }
    } catch (err) {
      console.error("Questions error:", err);
      submitFinalAnalysis([]);
    }
  };

  const handleAnswer = (answer) => {
    const newAnswers = [
      ...interviewAnswers, 
      { question: questions[currentQuestionIdx].question, answer }
    ];
    setInterviewAnswers(newAnswers);

    if (currentQuestionIdx + 1 < questions.length) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    } else {
      submitFinalAnalysis(newAnswers);
    }
  };

  const submitFinalAnalysis = async (answers) => {
    setPhase('analyzing');
    try {
      const response = await axios.post(`${API_BASE_URL}/api/symptom-analysing`, {
        symptoms,
        interviewAnswers: answers
      });
      setResult(response.data);
      setPhase('result');
    } catch (err) {
      console.error("Analysis error:", err);
      setError("Failed to analyze symptoms. Please check your connection and try again.");
      setPhase('input');
    }
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
          
          {phase === 'input' && (
            <section className="input-section full-width-centered">
              <div className="section-card">
                <h2>Describe how you feel</h2>
                <p className="subtitle">Please provide as much detail as possible about your symptoms, when they started, and their severity.</p>
                
                <form onSubmit={handleStartAnalysis}>
                  <textarea
                    className="symptom-textarea"
                    placeholder="Example: I've had a dull headache for 2 days, sharp pain in my lower back, and I've been feeling slightly nauseous since this morning..."
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                  />
                  
                  <button 
                    type="submit" 
                    className="analyze-btn"
                    disabled={!symptoms.trim()}
                  >
                    <Send size={18} />
                    <span>Start Analysis</span>
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
          )}

          {(phase === 'loading_questions' || phase === 'analyzing') && (
            <section className="result-section full-width-centered loading-wrapper">
              <div className="loading-state">
                <div className="pulse-loader">
                  <Activity size={48} className="pulse-icon" />
                </div>
                <h3>{phase === 'loading_questions' ? 'Preparing Clinical Interview' : 'Generating Diagnostic Report'}</h3>
                <p>{phase === 'loading_questions' 
                  ? 'Structuring follow-up questions based on your input...' 
                  : 'Healify AI is analyzing your complete profile against medical databases...'}
                </p>
              </div>
            </section>
          )}

          {phase === 'interview' && (
            <section className="interview-section full-width-centered">
              <div className="interview-card">
                <div className="interview-header">
                  <div className="interview-progress">
                    Question {currentQuestionIdx + 1} of {questions.length}
                  </div>
                  <div className="progress-bar-container">
                    <div 
                      className="progress-bar-fill" 
                      style={{ width: ((currentQuestionIdx / questions.length) * 100) + '%' }}
                    />
                  </div>
                </div>
                
                <h3 className="interview-question">
                  <span className="ai-badge">AI</span>
                  {questions[currentQuestionIdx].question}
                </h3>
                
                <div className="options-grid">
                  {questions[currentQuestionIdx].options.map((opt, i) => (
                    <button key={i} className="option-btn" onClick={() => handleAnswer(opt)}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </section>
          )}



          {phase === 'result' && result && (
            <section className="result-section full-width">
              <div className="analysis-result-card">
                <div className="result-header">
                  <div className="status-badge">AI Analysis Complete</div>
                  <h3>Clinical Triage Report</h3>
                </div>
                
                <div className="analysis-content report-container">
                  {parseAnalysisResult(result.analysis).map((sec, idx) => (
                    <CollapsibleSection key={idx} title={sec.title} content={sec.content} isOpen={false} />
                  ))}
                </div>

                <div className="disclaimer-box">
                  <AlertCircle size={18} />
                  <p>{result.disclaimer}</p>
                </div>

                <div className="next-steps">
                  <h4>Recommended Next Steps</h4>
                  <div className="step-options">
                    <button className="step-btn action-btn" onClick={() => navigate('/dashboard')}>
                      <span>Book an Appointment</span>
                      <ChevronRight size={16} />
                    </button>
                    <button className="step-btn secondary-btn" onClick={() => setPhase('input')}>
                      <span>Start New Analysis</span>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {error && phase === 'input' && (
            <section className="result-section full-width-centered">
               <div className="error-state">
                  <AlertCircle size={40} color="#ef4444" />
                  <h3>Analysis Error</h3>
                  <p>{error}</p>
                </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default SymptomAnalyzer;
