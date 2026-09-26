'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // localhost এর জায়গায় 127.0.0.1 ব্যবহার করা হয়েছে
    fetch('http://127.0.0.1:5000/api/users')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch users from server');
        return res.json();
      })
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('API Error:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen bg-slate-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-2">⚡ Dhaka Tesla Pool</h1>
      <p className="text-slate-400 mb-8">Share a seat. Split the fare. Survive Dhaka traffic.</p>

      {loading ? (
        <p className="text-amber-400 animate-pulse">Connecting to backend API...</p>
      ) : error ? (
        <div className="p-4 bg-red-900/40 border border-red-500/50 rounded-lg text-red-300 max-w-md">
          <p className="font-semibold">Backend Connection Failed!</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
          {users.map((user) => (
            <div key={user.id} className="p-4 bg-slate-800 rounded-lg border border-slate-700">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <span
                  className={`px-2 py-1 text-xs rounded font-medium ${
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