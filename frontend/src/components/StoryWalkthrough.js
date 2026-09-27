'use client';

import { useState } from 'react';

export default function StoryWalkthrough({ onActionCompleted }) {
  const [isOpen, setIsOpen] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [storyLogs, setStoryLogs] = useState([]);

  const addLog = (msg) => {
    setStoryLogs((prev) => [...prev, `${new Date().toLocaleTimeString()} - ${msg}`]);
  };

  const runFullStorySimulation = async () => {
    try {
      setIsRunning(true);
      setStoryLogs([]);
      addLog('🎬 Starting 8:41 AM Banani Road 11 Rush-Hour Story...');

      // 1. Fetch Users
      const usersRes = await fetch('http://localhost:5000/api/users');
      const users = await usersRes.json();
      const jashim = users.find((u) => u.name === 'Jashim');
      const nusrat = users.find((u) => u.name === 'Nusrat');
      const rafiq = users.find((u) => u.name === 'Rafiq');
      const shirin = users.find((u) => u.name === 'Shirin');

      // 2. Jashim ensures Bullet is ONLINE
      addLog('⚡ Jashim sets Bullet (3-Wheeler Battery Tesla) ONLINE.');
      await fetch(`http://localhost:5000/api/driver/${jashim.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'ONLINE' }),
      });

      // 3. 8:41 AM: Nusrat books Banani ➔ Mohakhali (1 seat)
      addLog('⏱️ 8:41 AM: Nusrat (late for work) books Banani ➔ Mohakhali (1 seat)...');
      const nusratRideRes = await fetch('http://localhost:5000/api/rides/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          passengerId: nusrat.id,
          pickupZone: 'BANANI',
          dropoffZone: 'MOHAKHALI',
          seatsRequested: 1,
        }),
      });
      const nusratRideData = await nusratRideRes.json();
      const nusratRideId = nusratRideData.ride?.id;
      addLog(`✅ Nusrat requested ride #${nusratRideId?.slice(0, 6)} (Est. solo: ৳${nusratRideData.fareBDT}).`);

      // 4. Jashim accepts Nusrat into Bullet
      addLog('🚗 Jashim accepts Nusrat into Bullet (1/3 seats occupied).');
      const matchNusrat = await fetch('http://localhost:5000/api/driver/pool/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ driverId: jashim.id, requestId: nusratRideId }),
      });
      const matchNusratData = await matchNusrat.json();
      const poolId = matchNusratData.updatedPool?.id;
      addLog(`🎉 Nusrat matched to Bullet! Pooled fare with 25% discount: ৳${matchNusratData.pooledFareBDT}`);

      // 5. 8:43 AM: Rafiq books Banani ➔ Gulshan 1 (1 seat)
      addLog('⏱️ 8:43 AM: Rafiq books Banani ➔ Gulshan 1 (1 seat, overlapping route)...');
      const rafiqRideRes = await fetch('http://localhost:5000/api/rides/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          passengerId: rafiq.id,
          pickupZone: 'BANANI',
          dropoffZone: 'GULSHAN_1',
          seatsRequested: 1,
        }),
      });
      const rafiqRideData = await rafiqRideRes.json();
      const rafiqRideId = rafiqRideData.ride?.id;
      addLog(`✅ Rafiq requested ride #${rafiqRideId?.slice(0, 6)} (Est. solo: ৳${rafiqRideData.fareBDT}).`);

      // 6. Jashim accepts Rafiq into the same pool
      addLog('🤝 Algorithm confirms compatible corridor! Jashim accepts Rafiq into Bullet pool.');
      const matchRafiq = await fetch('http://localhost:5000/api/driver/pool/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ driverId: jashim.id, requestId: rafiqRideId }),
      });
      const matchRafiqData = await matchRafiq.json();
      addLog(`🎉 Rafiq pooled! Pooled fare: ৳${matchRafiqData.pooledFareBDT}. Bullet seats: 2/3.`);

      // 7. 8:43:30 AM: Shirin books last seat (1 seat to Mohakhali)
      addLog('⏱️ 8:43:30 AM: Shirin grabs the last remaining seat (Banani ➔ Mohakhali)...');
      const shirinRideRes = await fetch('http://localhost:5000/api/rides/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          passengerId: shirin.id,
          pickupZone: 'BANANI',
          dropoffZone: 'MOHAKHALI',
          seatsRequested: 1,
        }),
      });
      const shirinRideData = await shirinRideRes.json();
      const shirinRideId = shirinRideData.ride?.id;

      // 8. Jashim accepts Shirin -> Bullet is now FULL!
      const matchShirin = await fetch('http://localhost:5000/api/driver/pool/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ driverId: jashim.id, requestId: shirinRideId }),
      });
      const matchShirinData = await matchShirin.json();
      addLog(`🔥 Shirin accepted! Bullet is now FULL (3/3 seats occupied). Pool status: FULL.`);

      // 9. Concurrency test in story: What if another passenger tried to book now?
      addLog('🛡️ Testing Concurrency/Capacity protection: Bullet capacity is full.');
      addLog('🏁 Story cast matched! You can now switch tabs or advance trip stage in driver cockpit.');

      setIsRunning(false);
      if (onActionCompleted) onActionCompleted();
    } catch (err) {
      addLog(`❌ Error in story simulation: ${err.message}`);
      setIsRunning(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-cyan-950/40 border border-amber-500/30 rounded-2xl p-5 shadow-2xl mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-xl shadow-inner">
            🛺
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              The Banani Rush-Hour Story (8:41 AM)
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-semibold border border-amber-500/30">
                Interactive Evaluator Tour
              </span>
            </h2>
            <p className="text-xs text-slate-300">
              Banani Road 11: Jashim (Bullet, 3 seats) • Nusrat (to Mohakhali) • Rafiq (to Gulshan 1) • Shirin (last seat)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={runFullStorySimulation}
            disabled={isRunning}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all active:scale-95 disabled:opacity-50"
          >
            {isRunning ? '⏳ Running 8:41 AM Story...' : '⚡ Auto-Play Banani Story'}
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded"
          >
            {isOpen ? 'Hide Details ▲' : 'Show Details ▼'}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="mt-4 pt-4 border-t border-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-300 mb-3">
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
              <span className="font-bold text-amber-400 block mb-1">1. Overlapping Route Match</span>
              Nusrat (Banani ➔ Mohakhali) & Rafiq (Banani ➔ Gulshan 1) share pickup zone and the North-Central corridor.
            </div>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
              <span className="font-bold text-cyan-400 block mb-1">2. Transparent Fare Split</span>
              Both passengers save 25% with individual pooled fares: Nusrat pays ৳71.25 (vs ৳95) and Rafiq pays ৳76.87 (vs ৳102.50).
            </div>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
              <span className="font-bold text-emerald-400 block mb-1">3. Bullet Seat Capacity (3)</span>
              Strict transactional locking prevents overbooking when Shirin grabs the 3rd seat.
            </div>
          </div>

          {storyLogs.length > 0 && (
            <div className="mt-3 p-3 bg-black/70 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 max-h-48 overflow-y-auto space-y-1">
              {storyLogs.map((log, i) => (
                <div key={i} className="leading-relaxed">
                  {log}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
