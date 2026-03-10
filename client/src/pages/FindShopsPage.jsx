import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Users, Star, Filter } from 'lucide-react';
import Navbar from '../components/Navbar';
// import { db } from '../data/mockDatabase';
import './FindShopsPage.css';

export default function FindShopsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/shops');
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        
        // Map backend fields to what component expects
        const mappedShops = await Promise.all(data.map(async (shop) => {
          // Fetch queue size for each shop
          let queueSize = 0;
          try {
             const qRes = await fetch(`http://localhost:5000/api/queue/status/${shop._id}`);
             if(qRes.ok) {
               const qData = await qRes.json();
               queueSize = qData.totalWaiting || 0;
             }
          } catch(e) {}
          
          return {
            id: shop._id,
            name: shop.shopName,
            location: shop.address?.area || shop.address?.city || 'Location unavailable',
            category: 'All', // We don't have category in schema yet, defaulting
            rating: shop.rating || 0,
            queueSize
          };
        }));
        setShops(mappedShops);
      } catch (err) {
        console.error("Error fetching shops", err);
      } finally {
        setLoading(false);
      }
    };
    fetchShops();
  }, []);

  const categories = ['All', 'Salon', 'Clinic', 'Auto', 'Food'];

  const filteredShops = shops.filter(shop => {
    const matchesSearch = shop.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          shop.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'All' || shop.category === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="find-shops-page">
      <Navbar />
      
      <div className="container dashboard-container">
        <header className="page-header text-center">
          <h1 className="text-gradient">Find Services</h1>
          <p className="text-muted">Discover nearby shops and join the queue digitally.</p>
          
          <div className="search-bar-wrapper mt-6">
            <div className="search-input-container">
              <Search className="search-icon text-muted" size={20} />
              <input 
                type="text" 
                placeholder="Search for shops, clinics, or areas..." 
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="filters-container mt-4 flex-center" style={{gap: '0.5rem', flexWrap: 'wrap'}}>
              <Filter size={16} className="text-muted mr-2" />
              {categories.map(cat => (
                <button 
                  key={cat}
                  className={`filter-badge ${filter === cat ? 'active' : ''}`}
                  onClick={() => setFilter(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </header>

        <section className="shops-grid-section">
          {loading ? (
            <div className="flex-center p-8"><span className="text-muted">Loading shops...</span></div>
          ) : (
            <>
              <div className="shops-grid">
                {filteredShops.map((shop) => (
                  <Link to={`/shop/${shop.id}`} key={shop.id} className="shop-card glass-panel hover-card">
                    <div className="shop-card-image skeleton"></div>
                    <div className="shop-card-content">
                      <div className="shop-header">
                        <h3>{shop.name}</h3>
                        <div className="rating-badge flex-center">
                          <Star size={14} fill="currentColor" />
                          <span>{shop.rating}</span>
                        </div>
                      </div>
                      
                      <div className="shop-details mt-2">
                        <p className="text-muted flex-center" style={{justifyContent: 'flex-start', gap: '6px'}}>
                          <MapPin size={16} /> {shop.location}
                        </p>
                        <p className="text-muted text-sm mt-1">{shop.category}</p>
                        <p className="queue-info flex-center" style={{justifyContent: 'flex-start', gap: '6px', marginTop: '4px'}}>
                          <Users size={16} className="text-accent" /> 
                          <span className={shop.queueSize > 10 ? 'warning text-bold' : 'text-bold'}>
                            {shop.queueSize} waiting
                          </span>
                        </p>
                      </div>
                      
                      <div className="mt-4">
                        <button className="btn-secondary full-width">View Details</button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              
              {filteredShops.length === 0 && (
                <div className="empty-state text-center mt-8">
                  <p className="text-muted">No shops found matching your criteria.</p>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
