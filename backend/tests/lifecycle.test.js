import {
  RIDE_STATUS,
  isValidRequestTransition,
  canPassengerCancel,
} from '../src/utils/lifecycle.js';

describe('Dhaka Tesla Pool - State Machine Lifecycle Transitions', () => {
  test('Valid happy-path transitions succeed in order', () => {
    expect(isValidRequestTransition(RIDE_STATUS.REQUESTED, RIDE_STATUS.MATCHED)).toBe(true);
    expect(isValidRequestTransition(RIDE_STATUS.MATCHED, RIDE_STATUS.DRIVER_ARRIVED)).toBe(true);
    expect(isValidRequestTransition(RIDE_STATUS.DRIVER_ARRIVED, RIDE_STATUS.STARTED)).toBe(true);
    expect(isValidRequestTransition(RIDE_STATUS.STARTED, RIDE_STATUS.COMPLETED)).toBe(true);
  });

  test('Invalid forward skips or reverse transitions are strictly rejected', () => {
    // Cannot jump from REQUESTED straight to COMPLETED
    expect(isValidRequestTransition(RIDE_STATUS.REQUESTED, RIDE_STATUS.COMPLETED)).toBe(false);

    // Cannot jump from MATCHED to COMPLETED
    expect(isValidRequestTransition(RIDE_STATUS.MATCHED, RIDE_STATUS.COMPLETED)).toBe(false);

    // Cannot go backwards from STARTED to MATCHED
    expect(isValidRequestTransition(RIDE_STATUS.STARTED, RIDE_STATUS.MATCHED)).toBe(false);

    // Cannot transition from COMPLETED to anything
    expect(isValidRequestTransition(RIDE_STATUS.COMPLETED, RIDE_STATUS.STARTED)).toBe(false);
  });

  test('Passenger cancellation rules are strictly enforced', () => {
    // Allowed to cancel while waiting for driver or just matched
    expect(canPassengerCancel(RIDE_STATUS.REQUESTED)).toBe(true);
    expect(canPassengerCancel(RIDE_STATUS.MATCHED)).toBe(true);

    // Forbidden to cancel after driver has arrived or ride has started
    expect(canPassengerCancel(RIDE_STATUS.DRIVER_ARRIVED)).toBe(false);
    expect(canPassengerCancel(RIDE_STATUS.STARTED)).toBe(false);
    expect(canPassengerCancel(RIDE_STATUS.COMPLETED)).toBe(false);
  });
});
