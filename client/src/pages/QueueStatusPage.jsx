import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RefreshCw, ArrowLeft, Bell, Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';
// import { db } from '../data/mockDatabase';
import { useAuth } from '../contexts/AuthContext';
import './QueueStatusPage.css';

export default function QueueStatusPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [leaving, setLeaving] = useState(false);

  const fetchStatus = async () => {
    if (!currentUser) return;
    try {
      const response = await fetch(`http://localhost:5000/api/queue/user-active/${currentUser.uid}`);
      if (!response.ok) {
         if (response.status === 404 && !loading) {
            navigate('/dashboard');
         }
         return;
      }
      const data = await response.json();
      
      // Need shop details too, fetch them safely
      const shopRes = await fetch('http://localhost:5000/api/shops');
      const allShops = await shopRes.json();
      const shop = allShops.find(s => s._id === data.shopId);

      const qStatusRes = await fetch(`http://localhost:5000/api/queue/status/${data.shopId}?firebaseUid=${currentUser.uid}`);
      const qStatus = await qStatusRes.json();

      setStatus({
        shop: { id: shop?._id, name: shop?.shopName },
        entry: { token: data.tokenNumber, status: data.status },
        currentToken: qStatus.currentServingToken || '--',
        position: qStatus.userPosition,
        estimatedWait: data.estimatedWaitTime || 10
      });

    } catch (err) {
      console.error("Error fetching queue data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 3000); // Polling faster on live status pg
    return () => clearInterval(interval);
  }, [currentUser, navigate]);

  const handleLeaveQueue = async () => {
    if (!status || !window.confirm('Are you sure you want to leave the queue? You will lose your spot.')) return;
    
    setLeaving(true);
    try {
      await fetch(`http://localhost:5000/api/queue/leave`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firebaseUid: currentUser.uid, shopId: status.shop.id })
      });
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setLeaving(false);
    }
  };

  if (loading) {
    return (
      <div className="queue-status-page">
        <Navbar />
        <div className="flex-center py-12"><Loader2 className="spin text-muted" size={40} /></div>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="queue-status-page">
        <Navbar />
        <div className="container mt-8 text-center">
          <p className="text-muted">No active queue found.</p>
          <Link to="/find-shops" className="btn-primary mt-4 inline-block">Find a Shop</Link>
        </div>
      </div>
    );
  }

  const isAlmostTurn = status.position <= 2;
  const isServing = status.entry.status === 'serving';

  return (
    <div className="queue-status-page">
      <Navbar />
      
      <div className="container overflow-hidden pt-8 pb-12">
        <div className="back-nav mb-6">
          <Link to="/dashboard" className="text-muted flex-center" style={{justifyContent: 'flex-start', gap: '8px', display: 'inline-flex'}}>
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
        </div>

        <div className={`queue-live-tracker glass-panel hover-card max-w-lg mx-auto relative overflow-hidden ${isServing ? 'serving-state' : ''}`}>
          <div className="animated-bg-glow"></div>
          
          <div className="live-header flex-between mb-8 relative z-10">
            <div>
              <h2 className="text-gradient">Live Queue</h2>
              <p className="text-muted">{status.shop.name}</p>
            </div>
            <button className="btn-icon" onClick={fetchStatus}>
              <RefreshCw size={20} className="text-muted" />
            </button>
          </div>

          <div className="tracker-visualization relative z-10">
            <div className="flex-between items-end mb-10 pb-6 border-b border-light">
              <div className="text-center">
                <p className="text-muted mb-2 text-sm uppercase tracking-wide">Current Token</p>
                <div className="token-display normal pulse-subtle">{status.currentToken}</div>
              </div>
              
              <div className="status-divider">
                <div className="status-line" style={{ background: isServing ? 'var(--success)' : ''}}></div>
                <div className="status-dots">
                  <span style={{background: isServing ? 'var(--success)' : ''}}></span>
                  <span style={{background: isServing ? 'var(--success)' : ''}}></span>
                  <span style={{background: isServing ? 'var(--success)' : ''}}></span>
                </div>
              </div>

              <div className="text-center">
                <p className="text-accent mb-2 text-sm uppercase tracking-wide font-bold">Your Token</p>
                <div className={`token-display highlighted ${!isServing ? 'pulse' : ''}`}>{status.entry.token}</div>
              </div>
            </div>

            <div className="grid-2 gap-4">
              <div className="info-block">
                <span className="info-label">Queue Position</span>
                <span className="info-value text-gradient">{isServing ? 'NOW' : `#${status.position}`}</span>
              </div>
              <div className="info-block highlight-warning">
                <span className="info-label">Estimated Wait</span>
                <span className="info-value">{isServing ? '0' : status.estimatedWait} mins</span>
              </div>
            </div>
          </div>

          {isServing ? (
             <div className="alert-box alert-success mt-6 relative z-10" style={{background: 'rgba(16, 185, 129, 0.2)'}}>
             <Bell size={20} />
             <p className="font-bold">It is your turn! Please proceed to the service area.</p>
           </div>
          ) : isAlmostTurn ? (
            <div className="alert-box alert-warning mt-6 relative z-10" style={{background: 'rgba(245, 158, 11, 0.1)', borderColor: 'rgba(245, 158, 11, 0.3)', color: '#f59e0b'}}>
              <Bell size={20} />
              <p>Your turn is approaching! Please arrive at the shop.</p>
            </div>
          ) : (
            <div className="alert-box mt-6 relative z-10">
              <Bell size={20} className="text-muted" />
              <p className="text-muted">We'll notify you when your turn is near.</p>
            </div>
          )}
          
          {!isServing && (
            <button 
              className="btn-secondary full-width mt-6 text-danger relative z-10 border-danger flex-center" 
              style={{marginTop: '1.5rem', background: 'rgba(239, 68, 68, 0.05)'}}
              onClick={handleLeaveQueue}
              disabled={leaving}
            >
              {leaving ? <Loader2 className="spin" size={20} /> : 'Leave Queue'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
