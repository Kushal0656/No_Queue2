import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, MapPin, Users, Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import './CreateShopPage.css'; // Will create simple styles or reuse AdminDashboard

export default function CreateShopPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    shopName: '',
    shopId: '',
    area: '',
    city: '',
    maxCapacity: 20
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return setError("Must be logged in");
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:5000/api/create-shop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firebaseUid: currentUser.uid,
          shopName: formData.shopName,
          shopId: formData.shopId,
          maxCapacity: Number(formData.maxCapacity),
          address: { area: formData.area, city: formData.city }
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to create shop');
      }

      navigate('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-shop-page">
      <Navbar isAdmin={true} />
      <div className="container dashboard-container" style={{maxWidth: '600px', margin: '4rem auto'}}>
        <div className="glass-panel p-8">
          <h2 className="text-gradient mb-6 text-center">Register New Shop</h2>
          {error && <div className="text-danger mb-4 text-center">{error}</div>}
          
          <form onSubmit={handleSubmit} className="flex-col" style={{gap: '1.5rem'}}>
            <div className="form-group">
              <label className="text-muted text-sm mb-2 block">Shop Name</label>
              <div className="input-with-icon" style={{position: 'relative'}}>
                <Store size={18} className="text-muted absolute left-3 top-3" style={{position: 'absolute', left: '12px', top: '12px'}} />
                <input 
                  type="text" 
                  name="shopName"
                  required
                  className="form-input w-full" 
                  style={{paddingLeft: '2.5rem', width: '100%'}}
                  value={formData.shopName}
                  onChange={handleChange}
                  placeholder="e.g. Raj Barber Shop"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="text-muted text-sm mb-2 block">Shop ID (Unique)</label>
              <input 
                type="text" 
                name="shopId"
                required
                className="form-input w-full"
                style={{width: '100%'}} 
                value={formData.shopId}
                onChange={handleChange}
                placeholder="e.g. RB1023"
              />
            </div>

            <div className="grid-2 gap-4">
              <div className="form-group">
                <label className="text-muted text-sm mb-2 block">Area / Locality</label>
                <div className="input-with-icon" style={{position: 'relative'}}>
                  <MapPin size={18} className="text-muted absolute left-3 top-3" style={{position: 'absolute', left: '12px', top: '12px'}} />
                  <input 
                    type="text" 
                    name="area"
                    required
                    className="form-input w-full"
                    style={{paddingLeft: '2.5rem', width: '100%'}}
                    value={formData.area}
                    onChange={handleChange}
                    placeholder="e.g. Ambattur"
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="text-muted text-sm mb-2 block">City</label>
                <input 
                  type="text" 
                  name="city"
                  required
                  className="form-input w-full"
                  style={{width: '100%'}} 
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Chennai"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="text-muted text-sm mb-2 block">Max Queue Capacity</label>
              <div className="input-with-icon" style={{position: 'relative'}}>
                <Users size={18} className="text-muted absolute left-3 top-3" style={{position: 'absolute', left: '12px', top: '12px'}} />
                <input 
                  type="number" 
                  name="maxCapacity"
                  required
                  min="5"
                  max="100"
                  className="form-input w-full"
                  style={{paddingLeft: '2.5rem', width: '100%'}}
                  value={formData.maxCapacity}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button type="submit" className="btn-primary full-width flex-center py-3 mt-4" disabled={loading}>
              {loading ? <Loader2 className="spin" /> : 'Register Shop'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
