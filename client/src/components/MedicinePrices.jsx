import React, { useState } from 'react';
import { Search, Activity, Pill, Store, ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MedicinePrices.css';
import { API_BASE_URL } from '../config';

const getStoreLogo = (storeName) => {
  if (storeName === 'Netmeds') return '/netmeds.avif';
  if (storeName.includes('Apollo')) return '/apollo.png';
  if (storeName === 'Tata1mg' || storeName === 'Tata 1mg' || storeName.includes('1mg')) return '/tata.png';
  return null;
};

const MedicinePrices = () => {
  const [query, setQuery] = useState('');
  const [medicineName, setMedicineName] = useState('');
  const [results, setResults] = useState([]);
  const [cheapest, setCheapest] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResults([]); // Clear previous results
    try {
      const res = await axios.get(`${API_BASE_URL}/api/medicines/search?q=${query}`);
      setMedicineName(res.data.medicine || query);
      setResults(res.data.results || []);
      setCheapest(res.data.cheapest || null);
    } catch (err) {
      console.error("Price search error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="medicine-prices-container">
      <header className="prices-header">
        <div className="header-content">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            <ArrowLeft size={20} />
          </button>
          <h1>Medicine Price Comparison</h1>
        </div>
        <div className="header-brand">
          <span>Healify</span>
          <Activity size={20} color="#2563eb" />
        </div>
      </header>

      <main className="prices-main">
        <div className="search-section">
          <form className="search-bar" onSubmit={handleSearch}>
            <Search className="search-icon" size={20} />
            <input 
              type="text" 
              placeholder="Search for medicine (e.g., Paracetamol, Aspirin)..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" disabled={loading}>
              {loading ? <Loader2 className="spinner" size={20} /> : "Search"}
            </button>
          </form>
        </div>

        <div className="results-section">
          {loading ? (
            <div className="loading-state">
              <Loader2 className="spinner" size={48} />
              <p>Searching for best prices across pharmacies...</p>
            </div>
          ) : results.length > 0 ? (
            <>
              <div className="results-grid">
                {results.map((item, index) => (
                  <div key={index} className={`price-card ${item.store === cheapest ? 'cheapest-deal' : ''}`}>
                    <div className="store-brand-header">
                      <img src={getStoreLogo(item.store)} alt={item.store} className="store-logo-img" />
                      {item.store === cheapest && <span className="best-deal-badge">Lowest Price</span>}
                    </div>
                    <div className="card-top">
                      <div className="med-info">
                        <Pill size={24} className="med-icon" />
                        <h3>{medicineName}</h3>
                      </div>
                      <div className="price-container">
                        <span className="price-tag">{item.price}</span>
                      </div>
                    </div>
                    <div className="card-bottom">
                      <div className="pharmacy-info">
                        <Store size={16} />
                        <span>{item.store}</span>
                      </div>
                      <a href={item.link} target="_blank" rel="noopener noreferrer" className="buy-btn">
                        View Deal
                      </a>
                    </div>
                  </div>
                ))}
              </div>
              {cheapest && (
                <div className="cheapest-note">
                  <span>💡</span>
                  <p><strong>Note:</strong> The cheapest <strong>{medicineName}</strong> is currently available at <span className="highlight-store">{cheapest}</span>.</p>
                </div>
              )}
            </>
          ) : (
            <div className="empty-state">
              <Pill size={64} className="faded-icon" />
              <h3>Search for Medicines</h3>
              <p>Compare prices from Netmeds, 1mg, Apollo, and more.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MedicinePrices;
