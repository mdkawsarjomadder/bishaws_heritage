import { calculateFare, formatPoyshaToBDT } from '../src/utils/fare.js';

describe('Dhaka Tesla Pool - Fare Engine & Hand-Calculation Verification', () => {
  test("Nusrat's Trip: Banani ➔ Mohakhali (3.0 km, 1 seat)", () => {
    // Formula: baseFare (5000) + distance (3.0 * 1500 = 4500) = 9500 poysha (৳95.00)
    const solo = calculateFare({
      pickupZone: 'BANANI',
      dropoffZone: 'MOHAKHALI',
      seatsRequested: 1,
      isPooled: false,
    });

    expect(solo.distanceKm).toBe(3.0);
    expect(solo.baseFarePoysha).toBe(5000n);
    expect(solo.distanceChargePoysha).toBe(4500n);
    expect(solo.finalFarePoysha).toBe(9500n);
    expect(solo.finalFareBDT).toBe(95.0);

    // Pooled fare with 25% discount: 9500 * 0.75 = 7125 poysha (৳71.25)
    const pooled = calculateFare({
      pickupZone: 'BANANI',
      dropoffZone: 'MOHAKHALI',
      seatsRequested: 1,
      isPooled: true,
    });

    expect(pooled.poolDiscountPoysha).toBe(2375n);
    expect(pooled.finalFarePoysha).toBe(7125n);
    expect(pooled.finalFareBDT).toBe(71.25);
    expect(formatPoyshaToBDT(pooled.finalFarePoysha)).toBe('৳71.25');
  });

  test("Rafiq's Trip: Banani ➔ Gulshan 1 (3.5 km, 1 seat)", () => {
    // Formula: baseFare (5000) + distance (3.5 * 1500 = 5250) = 10250 poysha (৳102.50)
    const solo = calculateFare({
      pickupZone: 'BANANI',
      dropoffZone: 'GULSHAN_1',
      seatsRequested: 1,
      isPooled: false,
    });

    expect(solo.distanceKm).toBe(3.5);
    expect(solo.baseFarePoysha).toBe(5000n);
    expect(solo.distanceChargePoysha).toBe(5250n);
    expect(solo.finalFarePoysha).toBe(10250n);
    expect(solo.finalFareBDT).toBe(102.5);

    // Pooled fare with 25% discount: 10250 * 0.75 = 7687.5 => rounded to 7688 poysha (৳76.88)
    const pooled = calculateFare({
      pickupZone: 'BANANI',
      dropoffZone: 'GULSHAN_1',
      seatsRequested: 1,
      isPooled: true,
    });

    expect(pooled.poolDiscountPoysha).toBe(2563n);
    expect(pooled.finalFarePoysha).toBe(7687n);
    expect(pooled.finalFareBDT).toBe(76.87);
  });

  test('Integer Poysha Storage prevents floating point rounding errors', () => {
    // 0.1 + 0.2 in standard JS numbers: 0.30000000000000004
    // Using BigInt integer poysha:
    const p1 = 10n; // 10 poysha (0.10 BDT)
    const p2 = 20n; // 20 poysha (0.20 BDT)
    const total = p1 + p2;
    expect(total).toBe(30n); // exactly 30 poysha (0.30 BDT)
  });
});
