/**
 * Dhaka Tesla Pool - Fare Calculation Engine
 * 
 * Money Storage Philosophy:
 * All monetary amounts are stored as integer Poysha (1 Taka = 100 Poysha).
 * Using integer arithmetic avoids IEEE-754 floating-point errors (e.g., 0.1 + 0.2 != 0.3),
 * ensuring exact ledgers for splitting fares and wallet balances.
 * 
 * Formula:
 * passengerFare = baseFare + distanceCharge - poolDiscount
 */

import { getZoneDistanceKm } from './geo.js';

export const FARE_CONFIG = {
  BASE_FARE_POYSHA: 5000n,          // 50 BDT
  PER_KM_RATE_POYSHA: 1500n,        // 15 BDT per km
  POOL_DISCOUNT_PERCENT: 25,        // 25% discount when pooled
  SEAT_SURCHARGE_FACTOR: 0.8,       // Subsequent seats get 20% discount on additional seat cost
};

/**
 * Calculates itemized fare in poysha
 * @param {Object} params
 * @param {string} params.pickupZone
 * @param {string} params.dropoffZone
 * @param {number} params.seatsRequested - defaults to 1
 * @param {boolean} params.isPooled - whether ride is part of a shared pool
 */
export function calculateFare({ pickupZone, dropoffZone, seatsRequested = 1, isPooled = false }) {
  const distanceKm = getZoneDistanceKm(pickupZone, dropoffZone);
  
  // Base fare in poysha
  const baseFarePoysha = FARE_CONFIG.BASE_FARE_POYSHA;

  // Distance charge: distanceKm * PER_KM_RATE_POYSHA
  // e.g. 3.0 km * 1500 poysha = 4500 poysha
  const distanceChargeNumber = Math.round(distanceKm * Number(FARE_CONFIG.PER_KM_RATE_POYSHA));
  const distanceChargePoysha = BigInt(distanceChargeNumber);

  // Seat multiplier (1st seat full price, extra seats slightly discounted)
  const seatMultiplier = seatsRequested === 1 ? 1 : 1 + (seatsRequested - 1) * FARE_CONFIG.SEAT_SURCHARGE_FACTOR;
  
  const subtotalBeforeDiscount = BigInt(Math.round(Number(baseFarePoysha + distanceChargePoysha) * seatMultiplier));

  // Pool discount: 25% if pooled
  let poolDiscountPoysha = 0n;
  if (isPooled) {
    const discountAmt = Math.round(Number(subtotalBeforeDiscount) * (FARE_CONFIG.POOL_DISCOUNT_PERCENT / 100));
    poolDiscountPoysha = BigInt(discountAmt);
  }

  const finalFarePoysha = subtotalBeforeDiscount - poolDiscountPoysha;

  return {
    distanceKm,
    seatsRequested,
    baseFarePoysha,
    distanceChargePoysha,
    poolDiscountPoysha,
    subtotalBeforeDiscount,
    finalFarePoysha,
    // Human readable BDT (for UI display)
    finalFareBDT: Number(finalFarePoysha) / 100,
    soloFareBDT: Number(subtotalBeforeDiscount) / 100,
  };
}

/**
 * Helper to convert Poysha to BDT currency string (e.g. ৳71.25)
 */
export function formatPoyshaToBDT(poysha) {
  const bdt = Number(poysha) / 100;
  return `৳${bdt.toFixed(2)}`;
}

/**
 * Convert BDT to Poysha BigInt
 */
export function bdtToPoysha(bdt) {
  return BigInt(Math.round(bdt * 100));
}
