import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import Auth from './components/Auth'
import Dashboard from './components/Dashboard'
import SymptomAnalyzer from './components/SymptomAnalyzer'
import MedicalAdvice from './components/MedicalAdvice'
import MedicinePrices from './components/MedicinePrices'
import PrescriptionReader from './components/PrescriptionReader'
import Appointments from './components/Appointments'
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
          <Route path="/medical-advice" element={<MedicalAdvice />} />
          <Route path="/price-comparison" element={<MedicinePrices />} />
          <Route path="/read-prescription" element={<PrescriptionReader />} />
          <Route path="/appointments" element={<Appointments />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
