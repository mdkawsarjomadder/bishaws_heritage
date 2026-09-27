/**
 * Ride & Pool State Machine Lifecycle Manager
 * 
 * Strict state transitions to prevent invalid states
 * (e.g. COMPLETED before STARTED, or CANCELLED after STARTED).
 */

export const RIDE_STATUS = {
  REQUESTED: 'REQUESTED',
  MATCHED: 'MATCHED',
  DRIVER_ARRIVED: 'DRIVER_ARRIVED',
  STARTED: 'STARTED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
};

export const POOL_STATUS = {
  OPEN: 'OPEN',
  FULL: 'FULL',
  STARTED: 'STARTED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
};

// Allowed forward transitions for a passenger's ride request
export const ALLOWED_REQUEST_TRANSITIONS = {
  [RIDE_STATUS.REQUESTED]: [RIDE_STATUS.MATCHED, RIDE_STATUS.CANCELLED],
  [RIDE_STATUS.MATCHED]: [RIDE_STATUS.DRIVER_ARRIVED, RIDE_STATUS.CANCELLED],
  [RIDE_STATUS.DRIVER_ARRIVED]: [RIDE_STATUS.STARTED],
  [RIDE_STATUS.STARTED]: [RIDE_STATUS.COMPLETED],
  [RIDE_STATUS.COMPLETED]: [],
  [RIDE_STATUS.CANCELLED]: [],
};

// Allowed forward transitions for a driver's pool
export const ALLOWED_POOL_TRANSITIONS = {
  [POOL_STATUS.OPEN]: [POOL_STATUS.FULL, POOL_STATUS.STARTED, POOL_STATUS.CANCELLED],
  [POOL_STATUS.FULL]: [POOL_STATUS.OPEN, POOL_STATUS.STARTED, POOL_STATUS.CANCELLED],
  [POOL_STATUS.STARTED]: [POOL_STATUS.COMPLETED],
  [POOL_STATUS.COMPLETED]: [],
  [POOL_STATUS.CANCELLED]: [],
};

/**
 * Validates if a transition from currentStatus to nextStatus is legitimate
 */
export function isValidRequestTransition(currentStatus, nextStatus) {
  const allowed = ALLOWED_REQUEST_TRANSITIONS[currentStatus] || [];
  return allowed.includes(nextStatus);
}

/**
 * Validates if passenger is permitted to cancel the ride
 * Rule: Can only cancel before driver arrives or ride starts
 */
export function canPassengerCancel(currentStatus) {
  return currentStatus === RIDE_STATUS.REQUESTED || currentStatus === RIDE_STATUS.MATCHED;
}
