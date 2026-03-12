import Loader from './components/Loader'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Services from './components/Services'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <div className="app-container">
      <Loader />
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Footer />
    </div>
  )
}

export default App
