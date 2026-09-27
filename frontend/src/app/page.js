'use client';

import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import CastSelector from '../components/CastSelector';
import StoryWalkthrough from '../components/StoryWalkthrough';
import PassengerView from '../components/PassengerView';
import DriverView from '../components/DriverView';
import AuditLogModal from '../components/AuditLogModal';

export default function Home() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuditOpen, setIsAuditOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getUsers();
      setUsers(data);
      if (!selectedUser && data.length > 0) {
        // Default to Nusrat (1st passenger from story)
        const nusrat = data.find((u) => u.name === 'Nusrat') || data[0];
        setSelectedUser(nusrat);
      } else if (selectedUser) {
        // Sync selected user data
        const updated = data.find((u) => u.id === selectedUser.id);
        if (updated) setSelectedUser(updated);
      }
    } catch (err) {
      setError(err.message || 'Failed to connect to Dhaka Tesla Pool backend');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [refreshKey]);

  const handleResetDemo = async () => {
    if (!confirm('Reset the entire system to 8:41 AM Banani initial state?')) return;
    try {
      setIsResetting(true);
      await api.resetDemo();
      setRefreshKey((k) => k + 1);
    } catch (err) {
      alert(`Reset failed: ${err.message}`);
    } finally {
      setIsResetting(false);
    }
  };

  const handleActionCompleted = () => {
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header & Actor Switcher */}
      <CastSelector
        users={users}
        selectedUser={selectedUser}
        onSelectUser={(u) => setSelectedUser(u)}
        onOpenAudit={() => setIsAuditOpen(true)}
        onResetDemo={handleResetDemo}
        isResetting={isResetting}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8">
        {/* Story Interactive Walkthrough Banner */}
        <StoryWalkthrough onActionCompleted={handleActionCompleted} />

        {loading && !selectedUser ? (
          <div className="p-16 text-center text-slate-400">
            <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="font-semibold text-lg text-white">Connecting to Bullet & Dhaka Tesla Nodes...</p>
            <p className="text-xs text-slate-500 mt-1">Starting up backend API on port 5000</p>
          </div>
        ) : error ? (
          <div className="p-8 bg-red-950/40 border border-red-500/50 rounded-2xl max-w-lg mx-auto text-center">
            <span className="text-4xl block mb-2">⚠️</span>
            <h3 className="text-lg font-bold text-red-200">Backend API Offline</h3>
            <p className="text-xs text-red-300 mt-2">{error}</p>
            <button
              onClick={() => setRefreshKey((k) => k + 1)}
              className="mt-4 px-4 py-2 bg-red-800 hover:bg-red-700 text-white rounded-xl text-xs font-semibold"
            >
              Retry Connection
            </button>
          </div>
        ) : selectedUser ? (
          <div>
            {selectedUser.role === 'DRIVER' ? (
              <DriverView
                key={`${selectedUser.id}-${refreshKey}`}
                user={selectedUser}
                onActionCompleted={handleActionCompleted}
              />
            ) : (
              <PassengerView
                key={`${selectedUser.id}-${refreshKey}`}
                user={selectedUser}
                onActionCompleted={handleActionCompleted}
              />
            )}
          </div>
        ) : null}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <p>
          Dhaka Tesla Pool MVP • Banani Road 11 Rush Hour • Bullet Capacity: 3 Seats
        </p>
      </footer>

      {/* Audit Log Modal */}
      <AuditLogModal
        isOpen={isAuditOpen}
        onClose={() => setIsAuditOpen(false)}
      />
    </div>
  );
}