import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Clock, Users, ArrowLeft, Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';
// import { db } from '../data/mockDatabase';
import { useAuth } from '../contexts/AuthContext';
import './ShopDetailsPage.css';

export default function ShopDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchShop = async () => {
      try {
        // Fetch all shops to find this one (since we don't have a getShopById endpoint yet, or we can add one, but we can filter from /shops for now)
        const response = await fetch('http://localhost:5000/api/shops');
        if (!response.ok) throw new Error('Failed to fetch shops');
        const shops = await response.json();
        const foundShop = shops.find(s => s._id === id);
        
        if (!foundShop) throw new Error('Shop not found');
        
        const qRes = await fetch(`http://localhost:5000/api/queue/status/${id}?firebaseUid=${currentUser?.uid || ''}`);
        let qData = { totalWaiting: 0, currentServingToken: null };
        if (qRes.ok) {
           qData = await qRes.json();
        }

        setShop({
          id: foundShop._id,
          name: foundShop.shopName,
          address: `${foundShop.address?.line || ''}, ${foundShop.address?.area || foundShop.address?.city || ''}`,
          rating: foundShop.rating || 0,
          reviews: foundShop.totalReviews || 0,
          category: 'All', // Default
          openTime: '09:00 AM - 08:00 PM',
          queueSize: qData.totalWaiting,
          currentToken: qData.currentServingToken || '--',
          avgTimePerPerson: 10
        });
      } catch (err) {
        setError('Shop not found');
      } finally {
        setLoading(false);
      }
    };
    fetchShop();
  }, [id, currentUser]);

  const handleJoinQueue = async () => {
    if (!currentUser) {
      if(window.confirm("You must be logged in to join a queue. Go to login?")) {
        navigate('/login');
      }
      return;
    }
    
    setJoining(true);
    try {
      const response = await fetch('http://localhost:5000/api/queue/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
           firebaseUid: currentUser.uid,
           shopId: id
        })
      });

      const data = await response.json();
      if (!response.ok) {
         throw new Error(data.message || 'Failed to join queue');
      }

      navigate('/queue-status'); 
    } catch (err) {
      setError(err.message || 'Failed to join queue');
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="shop-details-page">
        <Navbar />
        <div className="flex-center p-8 mt-8"><Loader2 className="spin text-muted" size={32} /></div>
      </div>
    );
  }

  if (error || !shop) {
    return (
      <div className="shop-details-page">
        <Navbar />
        <div className="container text-center mt-8">
          <h2 className="text-danger">{error}</h2>
          <Link to="/find-shops" className="btn-secondary mt-4 inline-block">Back to Shops</Link>
        </div>
      </div>
    );
  }

  const estimatedWait = shop.queueSize * shop.avgTimePerPerson;

  return (
    <div className="shop-details-page">
      <Navbar />
      
      <div className="container dashboard-container">
        <div className="back-nav">
          <Link to="/find-shops" className="text-muted flex-center" style={{justifyContent: 'flex-start', gap: '8px', display: 'inline-flex'}}>
            <ArrowLeft size={16} /> Back to Search
          </Link>
        </div>

        <div className="shop-hero glass-panel">
          <div className="shop-hero-content">
            <h1 className="text-gradient">{shop.name}</h1>
            <p className="shop-id text-muted">Shop ID: {shop.id}</p>
            
            <div className="shop-meta-tags mt-4">
              <span className="badge-rating text-bold">⭐ {shop.rating} ({shop.reviews} reviews)</span>
              <span className="badge-outline">{shop.category}</span>
            </div>
          </div>
        </div>

        <div className="shop-grid-layout mt-6">
          <div className="shop-main-info glass-panel">
            <h3 className="section-title">Shop Information</h3>
            
            <div className="info-item">
              <MapPin className="text-accent" size={20} />
              <div>
                <p className="text-bold">Location</p>
                <p className="text-muted whitespace-pre-line">{shop.address}</p>
              </div>
            </div>

            <div className="info-item mt-4">
              <Clock className="text-accent" size={20} />
              <div>
                <p className="text-bold">Opening Hours</p>
                <p className="text-muted">{shop.openTime}</p>
              </div>
            </div>
          </div>

          <div className="shop-queue-panel glass-panel">
            <h3 className="section-title text-center">Live Queue Status</h3>
            
            <div className="queue-status-circle flex-center mx-auto mt-4">
              <div className="inner-circle flex-center flex-col">
                <span className="text-muted text-sm">Serving Token</span>
                <span className="token-number text-gradient">{shop.currentToken}</span>
              </div>
            </div>

            <div className="queue-stats grid-2 mt-6">
              <div className="stat-box">
                <Users size={16} className="text-muted mb-1" />
                <span className="text-bold text-lg">{shop.queueSize}</span>
                <span className="text-muted text-sm">People Waiting</span>
              </div>
              <div className="stat-box highlight">
                <Clock size={16} className="text-warning mb-1" />
                <span className="text-bold text-lg text-warning">{estimatedWait}m</span>
                <span className="text-muted text-sm">Est. Wait Time</span>
              </div>
            </div>

            <button 
              className="btn-primary full-width mt-6 btn-large flex-center"
              onClick={handleJoinQueue}
              disabled={joining}
              style={{justifyContent: 'center'}}
            >
              {joining ? <Loader2 className="spin mr-2" size={20} /> : 'Join Queue Now'}
            </button>
            <p className="text-center text-muted text-xs mt-3">
              Joining the queue implies you will arrive on time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
