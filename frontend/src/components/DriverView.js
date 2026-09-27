'use client';

import { useState, useEffect } from 'react';
import { api } from '../lib/api';

export default function DriverView({ user, onActionCompleted }) {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getDriverDashboard(user.id);
      setDashboard(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [user.id]);

  const handleToggleOnline = async () => {
    if (!dashboard?.tesla) return;
    const nextStatus = dashboard.tesla.status === 'ONLINE' ? 'OFFLINE' : 'ONLINE';
    try {
      setActionLoading(true);
      setError(null);
      await api.setDriverStatus(user.id, nextStatus);
      await fetchDashboard();
      if (onActionCompleted) onActionCompleted();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAcceptRide = async (requestId) => {
    try {
      setActionLoading(true);
      setError(null);
      await api.acceptRideIntoPool(user.id, requestId);
      await fetchDashboard();
      if (onActionCompleted) onActionCompleted();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleTransition = async (targetStatus) => {
    if (!dashboard?.activePool) return;
    try {
      setActionLoading(true);
      setError(null);
      await api.transitionPool(dashboard.activePool.id, user.id, targetStatus);
      await fetchDashboard();
      if (onActionCompleted) onActionCompleted();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading && !dashboard) {
    return (
      <div className="p-12 text-center text-slate-400">
        <p className="animate-pulse">Loading Driver Cockpit...</p>
      </div>
    );
  }

  const tesla = dashboard?.tesla;
  const activePool = dashboard?.activePool;
  const pendingRequests = dashboard?.pendingRequests || [];
  const pastPools = dashboard?.pastPools || [];

  const occupiedSeats = activePool?.totalSeatsOccupied || 0;
  const maxCapacity = tesla?.capacity || 3;
  const isOnline = tesla?.status === 'ONLINE' || tesla?.status === 'IN_TRIP';

  // Seats visualization array
  const seatSlots = [1, 2, 3];
  // Flatten passengers by seats requested
  let occupiedSlots = [];
  if (activePool?.passengers) {
    activePool.passengers.forEach((p) => {
      for (let i = 0; i < p.seatsRequested; i++) {
        occupiedSlots.push(p);
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* Driver Cockpit Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-3xl shadow-inner">
            🛺
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-white">{user.name}</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-semibold">
                Bullet Driver
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Vehicle: <strong className="text-white">{tesla?.modelName}</strong> • Fixed Capacity:{' '}
              <strong className="text-amber-400">{maxCapacity} Seats</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Driver Earnings Wallet */}
          <div className="bg-slate-950/70 border border-slate-800 px-5 py-3 rounded-2xl flex items-center gap-3">
            <span className="text-2xl">💰</span>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Total Earnings
              </span>
              <span className="text-xl font-black text-emerald-400">
                ৳{dashboard?.driver?.walletBalanceBDT?.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Online/Offline Toggle */}
          <button
            onClick={handleToggleOnline}
            disabled={actionLoading}
            className={`px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider border transition-all active:scale-95 disabled:opacity-50 ${
              isOnline
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-lg shadow-emerald-500/10'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            {isOnline ? '● ONLINE' : '○ OFFLINE'}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-900/40 border border-red-500/50 rounded-xl text-red-200 text-sm flex items-center justify-between">
          <span>⚠️ {error}</span>
          <button onClick={() => setError(null)} className="text-xs underline text-red-400">
            Dismiss
          </button>
        </div>
      )}

      {/* Bullet Seat Capacity Representation */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white">Bullet Seat Capacity & Occupancy</h3>
            <p className="text-xs text-slate-400">
              {occupiedSeats} of {maxCapacity} seats occupied ({maxCapacity - occupiedSeats} remaining)
            </p>
          </div>
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full ${
              occupiedSeats === maxCapacity
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            }`}
          >
            {occupiedSeats === maxCapacity ? 'FULL (3/3)' : `OPEN (${occupiedSeats}/3)`}
          </span>
        </div>

        {/* Visual 3-seat Grid */}
        <div className="grid grid-cols-3 gap-4">
          {seatSlots.map((slotNum, idx) => {
            const occupant = occupiedSlots[idx];
            return (
              <div
                key={slotNum}
                className={`p-4 rounded-xl border text-center transition-all ${
                  occupant
                    ? 'bg-amber-500/10 border-amber-400/40 text-amber-300 shadow-lg shadow-amber-500/5'
                    : 'bg-slate-950/60 border-slate-800 text-slate-600 border-dashed'
                }`}
              >
                <div className="text-2xl mb-1">{occupant ? '💺' : '⚪'}</div>
                <div className="text-xs font-bold text-white">
                  Seat #{slotNum}: {occupant ? occupant.name : 'Empty'}
                </div>
                {occupant && (
                  <div className="text-[11px] text-amber-400/80 mt-1">
                    {occupant.dropoffZone} (৳{occupant.fareBDT?.toFixed(2)})
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Pool Lifecycle Management */}
      {activePool && activePool.passengers?.length > 0 && (
        <div className="bg-slate-900 border border-amber-500/40 rounded-2xl p-6 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Active Pool #{activePool.id.slice(0, 8)}
              </span>
              <h3 className="text-xl font-black text-white mt-1">
                {activePool.passengers.length} Passenger(s) in Bullet
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Current Pool Status: <strong className="text-white">{activePool.status}</strong>
              </p>
            </div>

            {/* Lifecycle Transition Buttons */}
            <div className="flex flex-wrap gap-2">
              {activePool.passengers[0]?.status === 'MATCHED' && (
                <button
                  onClick={() => handleTransition('DRIVER_ARRIVED')}
                  disabled={actionLoading}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition active:scale-95 disabled:opacity-50"
                >
                  📍 Mark Arrived at Banani Road 11
                </button>
              )}

              {activePool.passengers[0]?.status === 'DRIVER_ARRIVED' && (
                <button
                  onClick={() => handleTransition('STARTED')}
                  disabled={actionLoading}
                  className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg transition active:scale-95 disabled:opacity-50"
                >
                  🚀 Start Ride (Depart Banani)
                </button>
              )}

              {activePool.passengers[0]?.status === 'STARTED' && (
                <button
                  onClick={() => handleTransition('COMPLETED')}
                  disabled={actionLoading}
                  className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg transition active:scale-95 disabled:opacity-50"
                >
                  🏁 Complete Trip & Collect Fares
                </button>
              )}
            </div>
          </div>

          {/* Passengers on board table */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Manifest of Passengers on Board
            </span>
            {activePool.passengers.map((p) => (
              <div
                key={p.requestId}
                className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-white text-sm">{p.name}</span>
                  <span className="text-slate-400 ml-2">({p.seatsRequested} seat/s)</span>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Route: {p.pickupZone} ➔ {p.dropoffZone}
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-bold text-amber-400 block text-sm">৳{p.fareBDT?.toFixed(2)}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-semibold">
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pending Matchable Requests */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white">Incoming Passenger Ride Requests</h3>
            <p className="text-xs text-slate-400">
              Corridor algorithm matches Banani rush-hour passengers heading along compatible paths.
            </p>
          </div>
          <button
            onClick={fetchDashboard}
            className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            🔄 Refresh
          </button>
        </div>

        {pendingRequests.length === 0 ? (
          <p className="text-xs text-slate-500 italic py-4">
            No pending ride requests at this moment.
          </p>
        ) : (
          <div className="space-y-3">
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{req.passenger?.name}</span>
                    <span className="text-slate-400">({req.seatsRequested} seat/s)</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        req.isCompatible
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {req.isCompatible ? '✓ Compatible Route' : '✕ Capacity/Route Incompatible'}
                    </span>
                  </div>
                  <div className="text-slate-300 mt-1">
                    Route: <strong className="text-amber-400">{req.pickupZone}</strong> ➔{' '}
                    <strong className="text-cyan-400">{req.dropoffZone}</strong>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{req.reason}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-slate-400 block text-[11px]">Solo Est.</span>
                    <span className="font-bold text-white text-sm">৳{req.fareBDT?.toFixed(2)}</span>
                  </div>

                  <button
                    onClick={() => handleAcceptRide(req.id)}
                    disabled={actionLoading || !req.isCompatible || !isOnline}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg transition active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
                  >
                    Accept into Pool
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Pools History */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-base font-bold text-white mb-4">Completed Pools & History</h3>
        {pastPools.length === 0 ? (
          <p className="text-xs text-slate-500 italic">No completed pools yet.</p>
        ) : (
          <div className="space-y-3">
            {pastPools.map((pool) => (
              <div
                key={pool.id}
                className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-white">Pool #{pool.id.slice(0, 8)}</span>
                  <span className="text-slate-400 ml-2">
                    ({pool.rideRequests?.length} passengers completed)
                  </span>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Passengers:{' '}
                    {pool.rideRequests?.map((r) => r.passenger?.name).join(', ')}
                  </div>
                </div>

                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold">
                  COMPLETED
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
