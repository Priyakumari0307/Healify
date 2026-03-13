import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import Auth from './components/Auth'
import Dashboard from './components/Dashboard'
import SymptomAnalyzer from './components/SymptomAnalyzer'
import MedicalChat from './components/MedicalChat'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Auth initialMode="login" />} />
          <Route path="/signup" element={<Auth initialMode="signup" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/symptom-analyzer" element={<SymptomAnalyzer />} />
          <Route path="/medical-chat" element={<MedicalChat />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
