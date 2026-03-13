import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Activity, ArrowLeft, CheckCircle, MapPin, Users, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './Appointments.css';

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icons
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const blueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

const Appointments = () => {
  const [viewStep, setViewStep] = useState('collaborative'); // Default tab
  const [appointments, setAppointments] = useState([]);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    doctorName: 'Dr. Smith',
    date: '',
    symptoms: ''
  });
  const [isSuccess, setIsSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [userLocation, setUserLocation] = useState([23.6889, 86.9661]);
  const [clinics, setClinics] = useState([]);
  const [isSearchingMap, setIsSearchingMap] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchAppointments();
    // Fetch initial clinics for default location
    fetchClinicsNear(userLocation[0], userLocation[1]);
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/appointments');
      setAppointments(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const fetchClinicsNear = async (lat, lng) => {
    setIsSearchingMap(true);
    try {
      const query = `
        [out:json];
        (
          node["amenity"="hospital"](around:5000,${lat},${lng});
          node["amenity"="clinic"](around:5000,${lat},${lng});
        );
        out body;
      `;
      const res = await axios.post('https://overpass-api.de/api/interpreter', `data=${encodeURIComponent(query)}`, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      // process elements
      const fetchedClinics = res.data.elements.map((el) => ({
        id: el.id,
        name: el.tags.name || 'Unknown Clinic',
        address: el.tags['addr:full'] || el.tags['addr:street'] || 'Address not available',
        phone: el.tags.phone || el.tags['contact:phone'] || 'Not available',
        lat: el.lat,
        lng: el.lon,
        type: el.tags.amenity === 'hospital' ? 'Hospital' : 'Clinic'
      })).filter(c => c.name !== 'Unknown Clinic');
      
      setClinics(fetchedClinics);
    } catch(err) {
      console.error(err);
    } finally {
      setIsSearchingMap(false);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/appointments', {
         doctorName: formData.doctorName,
         specialization: 'General Physician',
         date: formData.date,
         time: '10:00 AM' 
      });
      setIsSuccess(true);
      fetchAppointments();
      setTimeout(() => setIsSuccess(false), 3000);
      setFormData({ fullName: '', email: '', doctorName: 'Dr. Smith', date: '', symptoms: '' });
    } catch (err) {
      console.error("Booking error:", err);
    }
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleSearchLocation = async () => {
    if (!searchQuery) return;
    setIsSearchingMap(true);
    try {
      const res = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}`);
      if (res.data && res.data.length > 0) {
        const { lat, lon } = res.data[0];
        const newLat = parseFloat(lat);
        const newLng = parseFloat(lon);
        setUserLocation([newLat, newLng]);
        fetchClinicsNear(newLat, newLng);
      } else {
        alert("Location not found. Please try another search.");
        setIsSearchingMap(false);
      }
    } catch(err) {
      console.error(err);
      setIsSearchingMap(false);
    }
  };

  const handleGeolocation = () => {
    if (navigator.geolocation) {
      setIsSearchingMap(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          fetchClinicsNear(latitude, longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Could not get your location. Please check browser permissions.");
          setIsSearchingMap(false);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  return (
    <div className="appointments-container">
      <header className="appointments-header">
        <div className="header-content">
          <button className="back-btn" onClick={handleBack}>
            <ArrowLeft size={20} />
          </button>
          <h1>Book an Appointment</h1>
        </div>
        <div className="header-brand">
          <span>Healify</span>
          <Activity size={20} color="#2563eb" />
        </div>
      </header>

      <main className="appointments-main">
        <div className="appointments-tabs-container">
          <button 
            className={`tab-btn ${viewStep === 'collaborative' ? 'active' : ''}`}
            onClick={() => setViewStep('collaborative')}
          >
            Collaborative Doctor
          </button>
          <button 
            className={`tab-btn ${viewStep === 'instant' ? 'active' : ''}`}
            onClick={() => setViewStep('instant')}
          >
            Instant Doctor
          </button>
        </div>

        <div className="appointments-grid">
          {viewStep === 'collaborative' && (
            <section className="booking-form-card collaborative-form-section">
              <h3>Book with a Collaborated Doctor</h3>
              <p className="form-subtitle">Select a doctor and schedule an appointment.</p>
              
              <form onSubmit={handleBooking} className="collaborative-form">
                <div className="form-group">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    placeholder="john.doe@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Preferred Doctor</label>
                  <select 
                    value={formData.doctorName} 
                    onChange={(e) => setFormData({...formData, doctorName: e.target.value})}
                  >
                    <option value="Dr. Smith">Select a doctor (Dr. Smith)</option>
                    <option value="Dr. Jane">Dr. Jane (Cardiologist)</option>
                    <option value="Dr. Bob">Dr. Bob (Dermatologist)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Appointment Date</label>
                  <input 
                    type="date" 
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Problem / Symptoms</label>
                  <textarea 
                    placeholder="Describe your symptoms or reason for visit"
                    value={formData.symptoms}
                    onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
                    required
                    rows="3"
                  ></textarea>
                </div>
                <button type="submit" className="book-now-btn">Confirm Appointment</button>
              </form>
              {isSuccess && (
                <div className="success-toast">
                  <CheckCircle size={20} />
                  <span>Appointment Booked!</span>
                </div>
              )}
            </section>
          )}

          {viewStep === 'instant' && (
            <section className="booking-form-card map-card-section">
              <h3>Nearby Clinics</h3>
              <p className="form-subtitle">Click a marker to view clinic details and call.</p>
              
              <div className="map-toolbar">
                 <input 
                   type="text" 
                   placeholder="Search location (e.g., Asansol, Kolkata, Mumbai)" 
                   className="map-search-input" 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   onKeyPress={(e) => e.key === 'Enter' && handleSearchLocation()}
                 />
                 <button className="map-search-btn" onClick={handleSearchLocation} disabled={isSearchingMap}>
                   {isSearchingMap ? 'Searching...' : 'Search'}
                 </button>
                 <button className="map-location-btn" onClick={handleGeolocation} disabled={isSearchingMap}>
                   <MapPin size={16}/> My Location
                 </button>
              </div>

              <div className="map-container-wrapper">
                <MapContainer center={userLocation} zoom={13} style={{ height: '100%', width: '100%' }}>
                  <ChangeView center={userLocation} zoom={13} />
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap contributors'
                  />
                  {/* Current User Location Marker */}
                  <Marker position={userLocation} icon={blueIcon}>
                    <Popup className="custom-popup">
                      <div className="popup-header">
                        <strong>Your Location</strong>
                        <span>Current</span>
                      </div>
                    </Popup>
                  </Marker>
                  
                  {clinics.map(clinic => (
                    <Marker key={clinic.id} position={[clinic.lat, clinic.lng]} icon={redIcon}>
                      <Popup className="custom-popup">
                        <div className="popup-header">
                          <strong>{clinic.name}</strong>
                          <span>{clinic.type || 'Clinic'}</span>
                        </div>
                        <div className="popup-body">
                          <div className="popup-info">
                            <MapPin size={14} color="#ef4444" />
                            <div>
                              <strong>Address:</strong>
                              <p>{clinic.address}</p>
                            </div>
                          </div>
                          <div className="popup-info">
                            <Phone size={14} color="#ef4444" />
                            <div>
                              <strong>Phone:</strong>
                              <p className={clinic.phone === 'Not available' || clinic.phone === 'undefined' ? 'text-red' : ''}>
                                {clinic.phone === 'undefined' ? 'Not available' : clinic.phone}
                              </p>
                            </div>
                          </div>
                          <button 
                            className="get-directions-btn" 
                            onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${clinic.lat},${clinic.lng}`, '_blank')}
                          >
                            <MapPin size={14}/> Get Directions
                          </button>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
              <div className="map-footer-status">
                 <MapPin size={16} color="#ef4444" /> <span>Found {clinics.length} clinics nearby</span>
              </div>
            </section>
          )}

          <section className="my-appointments">
            <h3>My Appointments</h3>
            <div className="appointments-list">
              {appointments.length > 0 ? appointments.map((app, idx) => (
                <div key={idx} className="app-card">
                  <div className="app-main-info">
                    <User size={20} color="#2563eb" />
                    <div>
                      <h4>{app.doctorName}</h4>
                      <span>{app.specialization}</span>
                    </div>
                  </div>
                  <div className="app-time-info">
                    <div className="info-row">
                      <Calendar size={16} />
                      <span>{app.date}</span>
                    </div>
                    <div className="info-row">
                      <Clock size={16} />
                      <span>{app.time}</span>
                    </div>
                  </div>
                  <div className={`status-badge ${app.status}`}>{app.status}</div>
                </div>
              )) : <p>No appointments yet.</p>}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Appointments;
