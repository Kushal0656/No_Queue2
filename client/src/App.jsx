import { Routes, Route } from 'react-router-dom';
import AnimatedLayout from './components/AnimatedLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import UserDashboard from './pages/UserDashboard';
import FindShopsPage from './pages/FindShopsPage';
import ShopDetailsPage from './pages/ShopDetailsPage';
import QueueStatusPage from './pages/QueueStatusPage';
import AdminDashboard from './pages/AdminDashboard';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import CreateShopPage from './pages/CreateShopPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route element={<AnimatedLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
        <Route path="/find-shops" element={<ProtectedRoute><FindShopsPage /></ProtectedRoute>} />
        <Route path="/shop/:id" element={<ProtectedRoute><ShopDetailsPage /></ProtectedRoute>} />
        <Route path="/queue-status" element={<ProtectedRoute><QueueStatusPage /></ProtectedRoute>} />
        
        {/* Admin Routes - Normally these would have a stricter Role check */}
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/create-shop" element={<ProtectedRoute><CreateShopPage /></ProtectedRoute>} />
        <Route path="/admin/analytics" element={<ProtectedRoute><AnalyticsDashboard /></ProtectedRoute>} />
      </Route>
    </Routes>
  );
}

export default App;
