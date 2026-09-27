const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

async function handleResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `HTTP error ${res.status}`);
  }
  return data;
}

export const api = {
  // Users
  getUsers: async () => {
    const res = await fetch(`${API_BASE}/api/users`, { cache: 'no-store' });
    return handleResponse(res);
  },

  // Fare estimation
  estimateFare: async (pickupZone, dropoffZone, seatsRequested = 1) => {
    const res = await fetch(`${API_BASE}/api/rides/estimate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pickupZone, dropoffZone, seatsRequested }),
    });
    return handleResponse(res);
  },

  // Passenger Rides
  requestRide: async (passengerId, pickupZone, dropoffZone, seatsRequested = 1) => {
    const res = await fetch(`${API_BASE}/api/rides/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passengerId, pickupZone, dropoffZone, seatsRequested }),
    });
    return handleResponse(res);
  },

  getPassengerRides: async (passengerId) => {
    const res = await fetch(`${API_BASE}/api/rides/passenger/${passengerId}`, {
      cache: 'no-store',
    });
    return handleResponse(res);
  },

  cancelRide: async (rideId, passengerId) => {
    const res = await fetch(`${API_BASE}/api/rides/${rideId}/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passengerId }),
    });
    return handleResponse(res);
  },

  // Driver Cockpit
  getDriverDashboard: async (driverId) => {
    const res = await fetch(`${API_BASE}/api/driver/${driverId}/dashboard`, {
      cache: 'no-store',
    });
    return handleResponse(res);
  },

  setDriverStatus: async (driverId, status) => {
    const res = await fetch(`${API_BASE}/api/driver/${driverId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return handleResponse(res);
  },

  acceptRideIntoPool: async (driverId, requestId) => {
    const res = await fetch(`${API_BASE}/api/driver/pool/accept`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ driverId, requestId }),
    });
    return handleResponse(res);
  },

  transitionPool: async (poolId, driverId, targetStatus) => {
    const res = await fetch(`${API_BASE}/api/driver/pool/${poolId}/transition`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ driverId, targetStatus }),
    });
    return handleResponse(res);
  },

  // Demo & Auditing
  resetDemo: async () => {
    const res = await fetch(`${API_BASE}/api/demo/reset`, {
      method: 'POST',
    });
    return handleResponse(res);
  },

  getAuditLogs: async () => {
    const res = await fetch(`${API_BASE}/api/demo/audit-logs`, {
      cache: 'no-store',
    });
    return handleResponse(res);
  },
};
