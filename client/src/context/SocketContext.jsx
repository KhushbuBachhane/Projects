import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { connectSocket, disconnectSocket, getSocket } from '../services/socket';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState([]);

  const addAlert = useCallback((alert) => {
    setAlerts((prev) => [alert, ...prev].slice(0, 10));
  }, []);

  const dismissAlert = useCallback((id) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  useEffect(() => {
    if (!user) {
      disconnectSocket();
      return;
    }

    const socket = connectSocket();

    const handleNew = (disaster) => {
      addAlert({
        id: `${disaster._id}-${Date.now()}`,
        type: 'new',
        title: 'New Disaster Report',
        message: `${disaster.title} — ${disaster.severity} severity`,
        disaster,
      });
    };

    const handleVerified = (disaster) => {
      addAlert({
        id: `${disaster._id}-verified-${Date.now()}`,
        type: 'verified',
        title: 'Report Verified',
        message: `"${disaster.title}" has been verified`,
        disaster,
      });
    };

    const handleSeverity = (disaster) => {
      addAlert({
        id: `${disaster._id}-severity-${Date.now()}`,
        type: 'severity',
        title: 'Severity Updated',
        message: `"${disaster.title}" is now ${disaster.severity}`,
        disaster,
      });
    };

    socket.on('newDisaster', handleNew);
    socket.on('disasterVerified', handleVerified);
    socket.on('severityUpdated', handleSeverity);

    return () => {
      socket.off('newDisaster', handleNew);
      socket.off('disasterVerified', handleVerified);
      socket.off('severityUpdated', handleSeverity);
    };
  }, [user, addAlert]);

  return (
    <SocketContext.Provider value={{ alerts, dismissAlert, socket: getSocket() }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error('useSocket must be used within SocketProvider');
  return ctx;
};
