'use client';

import { useState, useEffect } from 'react';
import { api } from '../lib/api';

export default function AuditLogModal({ isOpen, onClose }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      api.getAuditLogs()
        .then((data) => setLogs(data))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>📋</span> System Audit Ledger & History
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Immutable event log tracking pool formation, capacity limits, and lifecycle events.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 text-lg rounded-lg hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1 space-y-3 font-mono text-xs">
          {loading ? (
            <p className="text-amber-400 text-center animate-pulse">Loading audit ledger...</p>
          ) : logs.length === 0 ? (
            <p className="text-slate-500 text-center">No audit records logged yet.</p>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-400">{log.event}</span>
                  <span className="text-[11px] text-slate-500">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-slate-300 font-sans text-xs">{log.details}</p>
                {log.rideRequestId && (
                  <span className="text-[10px] text-slate-600 block">
                    Ride: {log.rideRequestId}
                  </span>
                )}
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
