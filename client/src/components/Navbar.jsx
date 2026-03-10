import { Link, useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, Search, BarChart3, Settings, User, PlusCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

export default function Navbar({ isAdmin = false }) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <nav className="navbar-glass">
      <div className="container flex-between navbar-container">
        <Link to={isAdmin ? "/admin" : "/dashboard"} className="navbar-brand">
          <span className="text-gradient">No_Queue</span>
        </Link>
        <div className="navbar-links">
          {isAdmin ? (
            <>
              <Link to="/admin" className="nav-link"><Settings size={18} /> Manage</Link>
              <Link to="/admin/analytics" className="nav-link"><BarChart3 size={18} /> Analytics</Link>
              <Link to="/admin/create-shop" className="nav-link"><PlusCircle size={18} /> New Shop</Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="nav-link"><LayoutDashboard size={18} /> Dashboard</Link>
              <Link to="/find-shops" className="nav-link"><Search size={18} /> Find</Link>
            </>
          )}

          <div className="user-profile-nav hidden-mobile flex-center ml-4">
            {currentUser?.photoURL ? (
              <img src={currentUser.photoURL} alt="Profile" className="nav-profile-pic" />
            ) : (
              <div className="nav-profile-placeholder flex-center">
                <User size={16} />
              </div>
            )}
            <span className="text-sm font-medium ml-2">{currentUser?.displayName || 'User'}</span>
          </div>

          <button onClick={handleLogout} className="btn-secondary logout-btn ml-2">
            <LogOut size={16} /> <span className="hidden-mobile">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
