import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { SocketProvider } from './context/SocketContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MapPage from './pages/MapPage';
import DisastersList from './pages/DisastersList';
import DisasterDetail from './pages/DisasterDetail';
import ReportDisaster from './pages/ReportDisaster';
import Dashboard from './pages/Dashboard';
import EmergencyContacts from './pages/EmergencyContacts';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageReports from './pages/admin/ManageReports';
import ManageUsers from './pages/admin/ManageUsers';
import ManageContacts from './pages/admin/ManageContacts';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <SocketProvider>
            <Routes>
              <Route element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="map" element={<MapPage />} />
                <Route path="disasters" element={<DisastersList />} />
                <Route path="disasters/:id" element={<DisasterDetail />} />
                <Route path="emergency" element={<EmergencyContacts />} />
                <Route path="report" element={<ProtectedRoute><ReportDisaster /></ProtectedRoute>} />
                <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
                <Route path="admin/reports" element={<ProtectedRoute adminOnly><ManageReports /></ProtectedRoute>} />
                <Route path="admin/users" element={<ProtectedRoute adminOnly><ManageUsers /></ProtectedRoute>} />
                <Route path="admin/contacts" element={<ProtectedRoute adminOnly><ManageContacts /></ProtectedRoute>} />
              </Route>
            </Routes>
          </SocketProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
