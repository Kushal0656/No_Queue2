import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './LoginPage.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Failed to log in with Google.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = (e) => {
    e.preventDefault();
    setError('Email login requires backend implementation. Please use Google Auth.');
  };

  return (
    <div className="login-container">
      <div className="login-background"></div>
      
      <motion.div 
        className="glass-panel login-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="login-header">
          <h2 className="text-gradient">Welcome back</h2>
          <p className="text-muted">Sign in to manage your queues seamlessly.</p>
        </div>

        {error && <div className="error-message mb-4">{error}</div>}

        <div className="login-form">
          <button 
            type="button" 
            className="google-auth-btn hover-card" 
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            {loading ? <Loader2 className="spin" size={20} /> : (
              <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                  <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                  <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                  <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                  <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                </g>
              </svg>
            )}
            {loading ? 'Signing in...' : 'Continue with Google'}
          </button>
          
          <div className="divider">
            <span>or sign in with email</span>
          </div>

          <form onSubmit={handleEmailLogin}>
            <div className="input-group mb-4">
              <input type="email" placeholder="Email address" className="form-input" required />
            </div>
            <div className="input-group mb-4">
              <input type="password" placeholder="Password" className="form-input" required />
            </div>

            <button type="submit" className="btn-primary login-btn">
              <LogIn size={18} /> Sign In
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
