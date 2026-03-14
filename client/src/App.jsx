import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import Auth from './components/Auth'
import Dashboard from './components/Dashboard'
import SymptomAnalyzer from './components/SymptomAnalyzer'
import MedicalAdvice from './components/MedicalAdvice'
import MedicinePrices from './components/MedicinePrices'
import PrescriptionReader from './components/PrescriptionReader'
import Appointments from './components/Appointments'
import HealthTips from './components/HealthTips'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Auth initialMode="login" />} />
          <Route path="/signup" element={<Auth initialMode="signup" />} />
          
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/symptom-analyzer" element={<ProtectedRoute><SymptomAnalyzer /></ProtectedRoute>} />
          <Route path="/medical-advice" element={<ProtectedRoute><MedicalAdvice /></ProtectedRoute>} />
          <Route path="/price-comparison" element={<ProtectedRoute><MedicinePrices /></ProtectedRoute>} />
          <Route path="/read-prescription" element={<ProtectedRoute><PrescriptionReader /></ProtectedRoute>} />
          <Route path="/appointments" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
          <Route path="/health-tips" element={<ProtectedRoute><HealthTips /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
