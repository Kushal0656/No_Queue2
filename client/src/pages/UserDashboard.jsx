import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Search, ListOrdered, Clock, Star, MapPin, Loader2, PlusCircle } from 'lucide-react';
// import { db } from '../data/mockDatabase';
import { useAuth } from '../contexts/AuthContext';
import './UserDashboard.css';

export default function UserDashboard() {
  const { currentUser } = useAuth();
  const [activeQueue, setActiveQueue] = useState(null);
  const [loading, setLoading] = useState(true);

  // Poll for queue status updates
  useEffect(() => {
    if (!currentUser) return;

    const fetchStatus = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/queue/user-active/${currentUser.uid}`);
        if (!response.ok) {
          setActiveQueue(null);
          setLoading(false);
          return;
        }
        const data = await response.json();

        const shopRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/shops`);
        const allShops = await shopRes.json();
        const shop = allShops.find(s => s._id === data.shopId);

        const qStatusRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/queue/status/${data.shopId}`);
        const qStatus = await qStatusRes.json();

        setActiveQueue({
          shop: {
            id: shop?._id,
            name: shop?.shopName || 'Unknown Shop',
            location: shop?.address?.area || 'Location'
          },
          entry: {
            token: data.tokenNumber,
            status: data.status
          },
          currentToken: qStatus.currentServingToken || '--',
          estimatedWait: data.estimatedWaitTime || 10
        });
      } catch (err) {
        console.error("Error fetching queue status", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 5000); // Polling every 5s
    return () => clearInterval(interval);
  }, [currentUser]);

  return (
    <div className="dashboard-page">
      <Navbar />

      <div className="container dashboard-container">
        <header className="dashboard-header glass-panel">
          <div>
            <h1 className="text-gradient">Welcome back, {currentUser?.displayName?.split(' ')[0] || 'User'}</h1>
            <p className="text-muted">You currently have {activeQueue ? '1' : '0'} active queue booking.</p>
          </div>
        </header>

        {loading ? (
          <div className="flex-center py-8"><Loader2 className="spin text-muted" size={32} /></div>
        ) : activeQueue ? (
          <section className="active-queue-section">
            <h3 className="section-title">Your Active Queue</h3>
            <div className="queue-status-card glass-panel hover-card">
              <div className="queue-header">
                <div>
                  <h4>{activeQueue.shop.name}</h4>
                  <p className="text-muted flex-center" style={{ justifyContent: 'flex-start', gap: '4px' }}>
                    <MapPin size={14} /> {activeQueue.shop.location}
                  </p>
                </div>
                {activeQueue.entry.status === 'serving' ? (
                  <div className="status-badge alert-success pulse">It's your turn!</div>
                ) : (
                  <div className="status-badge pulse">Waiting</div>
                )}
              </div>

              <div className="queue-stats grid-3">
                <div className="stat-box">
                  <span className="stat-label">Current Token</span>
                  <span className="stat-value text-gradient">{activeQueue.currentToken}</span>
                </div>
                <div className="stat-box highlight">
                  <span className="stat-label">Your Token</span>
                  <span className="stat-value">{activeQueue.entry.token}</span>
                </div>
                <div className="stat-box">
                  <span className="stat-label">Est. Wait</span>
                  <span className="stat-value warning">{activeQueue.estimatedWait}m</span>
                </div>
              </div>

              <div className="queue-actions">
                <Link to="/queue-status" className="btn-primary full-width text-center block">
                  View Live Status
                </Link>
              </div>
            </div>
          </section>
        ) : null}

        <section className="quick-actions-section">
          <h3 className="section-title">Quick Actions</h3>
          <div className="actions-grid">
            <Link to="/find-shops" className="action-card glass-panel hover-card">
              <div className="action-icon-wrapper blue">
                <Search size={24} />
              </div>
              <h4>Find Shops</h4>
              <p className="text-muted">Discover services near you</p>
            </Link>

            <Link to={activeQueue ? "/queue-status" : "#"} className={`action-card glass-panel hover-card ${!activeQueue ? 'opacity-50' : ''}`}>
              <div className="action-icon-wrapper purple">
                <ListOrdered size={24} />
              </div>
              <h4>Queue Status</h4>
              <p className="text-muted">{activeQueue ? 'Check your live position' : 'No active queue'}</p>
            </Link>

            <div className="action-card glass-panel hover-card">
              <div className="action-icon-wrapper green">
                <Clock size={24} />
              </div>
              <h4>Recent Shops</h4>
              <p className="text-muted">View past visits</p>
            </div>

            <div className="action-card glass-panel hover-card">
              <div className="action-icon-wrapper orange">
                <Star size={24} />
              </div>
              <h4>Reviews Submitted</h4>
              <p className="text-muted">Your given feedback</p>
            </div>

            {/* Added Create Shop Option on Dashboard */}
            <Link to="/admin/create-shop" className="action-card glass-panel hover-card" style={{ border: '1px solid var(--primary-light)' }}>
              <div className="action-icon-wrapper" style={{ backgroundColor: 'var(--primary)' }}>
                <PlusCircle size={24} color="#fff" />
              </div>
              <h4>Register a Shop</h4>
              <p className="text-muted">Are you a business owner?</p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
