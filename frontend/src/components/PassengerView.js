'use client';

import { useState, useEffect } from 'react';
import { api } from '../lib/api';

const DHAKA_ZONES = [
  { id: 'BANANI', name: 'Banani' },
  { id: 'MOHAKHALI', name: 'Mohakhali' },
  { id: 'GULSHAN_1', name: 'Gulshan 1' },
  { id: 'GULSHAN_2', name: 'Gulshan 2' },
  { id: 'FARM_GATE', name: 'Farmgate' },
  { id: 'DHANMONDI', name: 'Dhanmondi' },
  { id: 'MIRPUR', name: 'Mirpur' },
  { id: 'UTTARA', name: 'Uttara' },
];

export default function PassengerView({ user, onActionCompleted }) {
  const [activeRide, setActiveRide] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [error, setError] = useState(null);

  // Form states
  const [pickupZone, setPickupZone] = useState('BANANI');
  const [dropoffZone, setDropoffZone] = useState(user.name === 'Rafiq' ? 'GULSHAN_1' : 'MOHAKHALI');
  const [seatsRequested, setSeatsRequested] = useState(1);
  const [fareEstimate, setFareEstimate] = useState(null);

  const fetchRides = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getPassengerRides(user.id);
      setActiveRide(data.activeRide);
      setHistory(data.history || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRides();
    // Default dropoff based on user story
    if (user.name === 'Rafiq') {
      setDropoffZone('GULSHAN_1');
    } else {
      setDropoffZone('MOHAKHALI');
    }
  }, [user.id]);

  // Live estimate recalculation
  useEffect(() => {
    let isCurrent = true;
    api.estimateFare(pickupZone, dropoffZone, seatsRequested)
      .then((est) => {
        if (isCurrent) setFareEstimate(est);
      })
      .catch(() => {});
    return () => { isCurrent = false; };
  }, [pickupZone, dropoffZone, seatsRequested]);

  const handleBookRide = async (e) => {
    e.preventDefault();
    try {
      setRequesting(true);
      setError(null);
      await api.requestRide(user.id, pickupZone, dropoffZone, seatsRequested);
      await fetchRides();
      if (onActionCompleted) onActionCompleted();
    } catch (err) {
      setError(err.message);
    } finally {
      setRequesting(false);
    }
  };

  const handleCancelRide = async (rideId) => {
    if (!confirm('Are you sure you want to cancel this ride request?')) return;
    try {
      setCancelling(true);
      setError(null);
      await api.cancelRide(rideId, user.id);
      await fetchRides();
      if (onActionCompleted) onActionCompleted();
    } catch (err) {
      setError(err.message);
    } finally {
      setCancelling(false);
    }
  };

  const steps = [
    { key: 'REQUESTED', label: '1. Requested' },
    { key: 'MATCHED', label: '2. Matched' },
    { key: 'DRIVER_ARRIVED', label: '3. Bullet Arrived' },
    { key: 'STARTED', label: '4. In Transit' },
    { key: 'COMPLETED', label: '5. Arrived' },
  ];

  const getStepIndex = (status) => {
    switch (status) {
      case 'REQUESTED': return 0;
      case 'MATCHED': return 1;
      case 'DRIVER_ARRIVED': return 2;
      case 'STARTED': return 3;
      case 'COMPLETED': return 4;
      default: return -1;
    }
  };

  const currentStepIdx = activeRide ? getStepIndex(activeRide.status) : -1;
  const canCancel = activeRide && (activeRide.status === 'REQUESTED' || activeRide.status === 'MATCHED');

  return (
    <div className="space-y-6">
      {/* Passenger Header & Wallet */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-3xl shadow-inner">
            👤
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-white">{user.name}</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-semibold">
                Passenger
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">{user.email}</p>
          </div>
        </div>

        {/* Simulated TeslaPay Wallet */}
        <div className="flex items-center gap-3 bg-slate-950/70 border border-slate-800 px-5 py-3 rounded-2xl">
          <span className="text-2xl">💳</span>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              TeslaPay Balance
            </span>
            <span className="text-xl font-black text-emerald-400">
              ৳{(Number(user.walletBalancePoysha || 0) / 100).toFixed(2)}
            </span>
          </div>
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

      {/* Active Ride Section */}
      {activeRide ? (
        <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl -z-0"></div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800">
            <div>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                Live Active Trip
              </span>
              <h3 className="text-xl font-black text-white mt-1">
                {activeRide.pickupZone} ➔ {activeRide.dropoffZone}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Seats booked: <strong className="text-white">{activeRide.seatsRequested}</strong> • Requested at: {new Date(activeRide.createdAt).toLocaleTimeString()}
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400 block">Your Individual Fare</span>
              <span className="text-3xl font-black text-amber-400">
                ৳{activeRide.fareBDT?.toFixed(2)}
              </span>
              {activeRide.isPooled && (
                <span className="block text-[11px] font-semibold text-emerald-400 mt-0.5">
                  ✓ 25% Pool Split Applied
                </span>
              )}
            </div>
          </div>

          {/* Lifecycle Stepper */}
          <div className="mb-8">
            <span className="text-xs font-bold text-slate-400 block mb-3 uppercase tracking-wider">
              Ride Progress Status
            </span>
            <div className="grid grid-cols-5 gap-2">
              {steps.map((st, idx) => {
                const isPassed = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;
                return (
                  <div
                    key={st.key}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      isCurrent
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold shadow-lg shadow-amber-500/10'
                        : isPassed
                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-950/40 border-slate-800 text-slate-500'
                    }`}
                  >
                    <div className="text-xs">{st.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Vehicle & Driver Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800 mb-6">
            <div>
              <span className="text-xs text-slate-400 block">Driver</span>
              <span className="font-bold text-white text-base">
                {activeRide.driver ? `Jashim (${activeRide.driver})` : 'Awaiting Driver Match...'}
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Assigned Vehicle</span>
              <span className="font-bold text-amber-400 text-base">
                {activeRide.vehicle || 'Bullet (3-Wheeler Battery Tesla)'}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between">
            <button
              onClick={fetchRides}
              className="text-xs px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              🔄 Refresh Status
            </button>

            {canCancel ? (
              <button
                onClick={() => handleCancelRide(activeRide.id)}
                disabled={cancelling}
                className="px-4 py-2 rounded-xl bg-red-900/40 hover:bg-red-900/60 text-red-300 text-xs font-bold border border-red-500/30 transition disabled:opacity-50"
              >
                {cancelling ? 'Cancelling...' : 'Cancel Ride'}
              </button>
            ) : (
              <span className="text-xs text-slate-500 italic">
                Cannot cancel once Bullet arrives or ride has started.
              </span>
            )}
          </div>
        </div>
      ) : (
        /* Ride Booking Form */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="mb-6">
            <h3 className="text-xl font-black text-white">Book a Tesla Pool Ride</h3>
            <p className="text-xs text-slate-400 mt-1">
              Select your pickup and dropoff points across Dhaka to see transparent fare estimates.
            </p>
          </div>

          <form onSubmit={handleBookRide} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Pickup Zone
                </label>
                <select
                  value={pickupZone}
                  onChange={(e) => setPickupZone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                >
                  {DHAKA_ZONES.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Dropoff Zone
                </label>
                <select
                  value={dropoffZone}
                  onChange={(e) => setDropoffZone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                >
                  {DHAKA_ZONES.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Seats Requested
                </label>
                <select
                  value={seatsRequested}
                  onChange={(e) => setSeatsRequested(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                >
                  <option value={1}>1 Seat (Normal)</option>
                  <option value={2}>2 Seats</option>
                  <option value={3}>3 Seats (Entire Bullet)</option>
                </select>
              </div>
            </div>

            {/* Live Fare Breakdown Comparison */}
            {fareEstimate && (
              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Estimated Fare Breakdown ({fareEstimate.distanceKm} km)
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-xs text-slate-400 block">Solo Ride Price</span>
                    <span className="text-xl font-bold text-slate-300">
                      ৳{fareEstimate.solo?.fareBDT?.toFixed(2)}
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      Base: ৳50 + ৳15/km
                    </span>
                  </div>

                  <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/30">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-amber-400 font-semibold block">
                        Tesla Pool Price
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                        SAVE 25%
                      </span>
                    </div>
                    <span className="text-2xl font-black text-amber-400">
                      ৳{fareEstimate.pooled?.fareBDT?.toFixed(2)}
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      Split fare discount automatically applied when matched
                    </span>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={requesting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-xl shadow-cyan-500/20 transition-all active:scale-[0.99] disabled:opacity-50"
            >
              {requesting ? 'Requesting Ride...' : '🚀 Request Ride'}
            </button>
          </form>
        </div>
      )}

      {/* Ride History */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-base font-bold text-white mb-4">Past Ride History</h3>
        {history.length === 0 ? (
          <p className="text-xs text-slate-500 italic">No completed or cancelled rides yet.</p>
        ) : (
          <div className="space-y-2">
            {history.map((h) => (
              <div
                key={h.id}
                className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-white">
                    {h.pickupZone} ➔ {h.dropoffZone}
                  </span>
                  <span className="text-slate-400 ml-2">({h.seatsRequested} seat/s)</span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    {new Date(h.createdAt).toLocaleDateString()} at {new Date(h.createdAt).toLocaleTimeString()}
                  </span>
                </div>

                <div className="text-right">
                  <span className="font-bold text-amber-400 block">৳{h.fareBDT?.toFixed(2)}</span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      h.status === 'COMPLETED'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {h.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
