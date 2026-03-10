import { useState, useEffect } from 'react';
import { UserCheck, SkipForward, RotateCcw, CheckCircle, Loader2, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
// import { db } from '../data/mockDatabase';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const { currentUser } = useAuth();
  const [shopId, setShopId] = useState(''); 
  const [shops, setShops] = useState([]);
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentlyServing, setCurrentlyServing] = useState(null);
  
  const fetchAdminData = async () => {
    if (!currentUser) return;
    try {
      const response = await fetch(`http://localhost:5000/api/shops/admin/${currentUser.uid}`);
      if (!response.ok) throw new Error("Failed to fetch admin shops");
      const adminShops = await response.json();
      setShops(adminShops);
      
      let currentShopId = shopId;
      if (!shopId && adminShops.length > 0) {
         setShopId(adminShops[0]._id);
         currentShopId = adminShops[0]._id;
      }
      
      if (currentShopId) {
        const qRes = await fetch(`http://localhost:5000/api/queue/status/${currentShopId}`);
        if(qRes.ok) {
           const qData = await qRes.json();
           const mappedQ = (qData.queueList || []).map((q, idx) => ({
             id: q._id,
             token: q.tokenNumber,
             userName: q.userId?.name || 'Anonymous',
             status: q.status
           }));
           // Mocked concept: first waiting person is not "serving", we just map the first as currently serving in logic below,
           // but technically my schema only uses 'waiting', 'served', 'cancelled'. 
           if (mappedQ.length > 0) {
             setCurrentlyServing(mappedQ[0]);
           } else {
             setCurrentlyServing(null);
           }
           setQueue(mappedQ.slice(1)); // Rest is waiting queue
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
    const interval = setInterval(fetchAdminData, 3000); 
    return () => clearInterval(interval);
  }, [shopId, currentUser]);

  const handleNext = async () => { /* In this simple schema, completing acts same as next */ };
  
  const handleComplete = async () => {
    try {
      if(!shopId) return;
      await fetch('http://localhost:5000/api/queue/call-next', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ shopId, adminFirebaseUid: currentUser.uid })
      });
      fetchAdminData();
    } catch(err) {
      console.error(err);
    }
  };
  
  const handleReset = async () => {
    if (window.confirm('Real mock doesn\'t have reset API yet. Simulate?')) {
       // Optional: implement clear endpoint later
    }
  };

  const waitingQueue = queue;

  if (loading && queue.length === 0) {
     return (
        <div className="admin-dashboard-page">
          <Navbar isAdmin={true} />
          <div className="flex-center py-12"><Loader2 className="spin text-muted" size={40} /></div>
        </div>
     );
  }

  return (
    <div className="admin-dashboard-page">
      <Navbar isAdmin={true} />
      
      <div className="container dashboard-container">
        <header className="dashboard-header glass-panel flex-between" style={{flexWrap: 'wrap', gap: '1rem'}}>
          <div>
            <h1 className="text-gradient">Shop Management</h1>
            <p className="text-muted">Manage your live waitlist and service flow.</p>
          </div>
          
          <div className="shop-selector flex-center" style={{gap: '1rem'}}>
             <select 
               className="form-input" 
               style={{minWidth: '250px'}} 
               value={shopId} 
               onChange={(e) => setShopId(e.target.value)}
             >
               {shops.length === 0 && <option value="">No Shops</option>}
               {shops.map(s => (
                 <option key={s._id} value={s._id}>{s.shopName} ({s.shopId})</option>
               ))}
             </select>
             
             <Link to="/admin/create-shop" className="btn-secondary flex-center" style={{padding: '0.6rem 1rem'}}>
               <Plus size={16} className="mr-2" /> New Shop
             </Link>
          </div>
        </header>

        <div className="admin-grid-layout mt-6">
          <div className="control-panel glass-panel">
            <h3 className="section-title">Current Status</h3>
            
            <div className="active-token-display text-center my-6">
              <p className="text-muted uppercase text-sm font-bold tracking-wide mb-2">Serving Token</p>
              <div className={`massive-token ${!currentlyServing ? 'opacity-50' : ''}`}>
                {currentlyServing ? currentlyServing.token : '--'}
              </div>
              {currentlyServing && <p className="mt-2 text-muted">Customer: {currentlyServing.userName}</p>}
            </div>

            <div className="admin-actions mt-8">
              <button 
                className="btn-primary full-width flex-center mb-4 text-lg py-3" 
                onClick={handleNext}
                disabled={waitingQueue.length === 0}
              >
                <SkipForward className="mr-2" /> Call Next Token {waitingQueue.length > 0 && `(${waitingQueue[0].token})`}
              </button>
              
              <button 
                className={`btn-secondary full-width flex-center py-3 mb-4 ${currentlyServing ? 'text-success border-success-subtle hover-bg-success' : 'opacity-50'}`}
                onClick={handleComplete}
                disabled={!currentlyServing}
              >
                <CheckCircle className="mr-2" size={18} /> Mark Service Completed
              </button>
              
              <button 
                className="btn-secondary full-width flex-center text-danger border-danger-subtle py-3"
                onClick={handleReset}
              >
                <RotateCcw className="mr-2" size={18} /> Reset Queue
              </button>
            </div>
          </div>

          <div className="queue-list-panel glass-panel">
            <h3 className="section-title flex-between">
              Live Waitlist
              <span className="badge-outline text-sm font-normal">{waitingQueue.length} Waiting</span>
            </h3>
            
            <div className="queue-items-container mt-4">
              {waitingQueue.length > 0 ? (
                waitingQueue.map((item, index) => (
                  <div key={index} className="queue-list-item">
                    <div className="queue-item-left">
                      <div className="queue-position-indicator">
                        {index === 0 ? 'Next' : `#${index + 1}`}
                      </div>
                      <div className="queue-item-info">
                        <span className="queue-item-token">Token {item.token}</span>
                        <span className="queue-item-user text-muted">{item.userName}</span>
                      </div>
                    </div>
                    <div className="queue-item-actions">
                       {/* You could add a direct call token button here */}
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-queue flex-col flex-center text-center p-8 mt-4" style={{minHeight: '200px'}}>
                  {currentlyServing ? (
                    <>
                      <div className="empty-icon-circle mb-4" style={{fontSize: '2rem'}}>⏳</div>
                      <h4 className="text-lg text-primary">No one is waiting</h4>
                      <p className="text-muted">You are currently serving the last customer.</p>
                    </>
                  ) : (
                    <>
                      <div className="empty-icon-circle mb-4" style={{fontSize: '2rem'}}>🎉</div>
                      <h4 className="text-lg text-primary">Queue is empty!</h4>
                      <p className="text-muted">All customers have been served.</p>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
