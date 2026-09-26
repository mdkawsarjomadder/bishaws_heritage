'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:4000/api/users')
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('API Error:', err);
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen bg-slate-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-2">⚡ Dhaka Tesla Pool</h1>
      <p className="text-slate-400 mb-8">Share a seat. Split the fare. Survive Dhaka traffic.</p>

      {loading ? (
        <p>Connecting to backend API...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
          {users.map((user) => (
            <div key={user.id} className="p-4 bg-slate-800 rounded-lg border border-slate-700">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <span
                  className={`px-2 py-1 text-xs rounded ${
                    user.role === 'DRIVER' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'
                  }`}
                >
                  {user.role}
                </span>
              </div>
              <p className="text-sm text-slate-400">{user.email}</p>
              {user.tesla && (
                <div className="mt-3 pt-3 border-t border-slate-700 text-xs text-slate-300">
                  <p>Vehicle: <strong>{user.tesla.modelName}</strong></p>
                  <p>Capacity: {user.tesla.capacity} seats</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}