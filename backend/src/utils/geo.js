/**
 * Dhaka Geography & Route Matching Module
 * 
 * Provides predefined Dhaka zones, approximate point-to-point distances,
 * arterial corridors, and pool-compatibility matching logic.
 */

export const DHAKA_ZONES = {
  BANANI: { name: 'Banani', corridor: 'NORTH_CENTRAL', lat: 23.7937, lng: 90.4066 },
  GULSHAN_1: { name: 'Gulshan 1', corridor: 'NORTH_CENTRAL', lat: 23.7788, lng: 90.4168 },
  GULSHAN_2: { name: 'Gulshan 2', corridor: 'NORTH_CENTRAL', lat: 23.7925, lng: 90.4150 },
  MOHAKHALI: { name: 'Mohakhali', corridor: 'NORTH_CENTRAL', lat: 23.7776, lng: 90.4005 },
  FARM_GATE: { name: 'Farmgate', corridor: 'CENTRAL_SOUTH', lat: 23.7561, lng: 90.3872 },
  DHANMONDI: { name: 'Dhanmondi', corridor: 'SOUTH_WEST', lat: 23.7461, lng: 90.3742 },
  MIRPUR: { name: 'Mirpur', corridor: 'NORTH_WEST', lat: 23.8223, lng: 90.3654 },
  UTTARA: { name: 'Uttara', corridor: 'FAR_NORTH', lat: 23.8759, lng: 90.3795 },
};

// Distance matrix (km) between key Dhaka hubs
export const DISTANCE_MATRIX_KM = {
  'BANANI-MOHAKHALI': 3.0,
  'BANANI-GULSHAN_1': 3.5,
  'BANANI-GULSHAN_2': 1.8,
  'BANANI-FARM_GATE': 6.0,
  'BANANI-DHANMONDI': 8.5,
  'BANANI-MIRPUR': 7.5,
  'BANANI-UTTARA': 9.0,

  'GULSHAN_1-MOHAKHALI': 2.2,
  'GULSHAN_1-GULSHAN_2': 2.0,
  'GULSHAN_1-FARM_GATE': 5.8,
  'GULSHAN_1-DHANMONDI': 8.0,
  'GULSHAN_1-MIRPUR': 8.5,
  'GULSHAN_1-UTTARA': 10.5,

  'GULSHAN_2-MOHAKHALI': 3.2,
  'GULSHAN_2-FARM_GATE': 6.8,
  'GULSHAN_2-DHANMONDI': 9.0,
  'GULSHAN_2-MIRPUR': 8.0,
  'GULSHAN_2-UTTARA': 8.8,

  'MOHAKHALI-FARM_GATE': 3.8,
  'MOHAKHALI-DHANMONDI': 6.2,
  'MOHAKHALI-MIRPUR': 7.0,
  'MOHAKHALI-UTTARA': 10.0,

  'FARM_GATE-DHANMONDI': 3.0,
  'FARM_GATE-MIRPUR': 7.0,
  'FARM_GATE-UTTARA': 13.0,

  'DHANMONDI-MIRPUR': 8.5,
  'DHANMONDI-UTTARA': 15.0,

  'MIRPUR-UTTARA': 9.5,
};

/**
 * Returns estimated road distance in km between two zones
 */
export function getZoneDistanceKm(zoneA, zoneB) {
  if (zoneA === zoneB) return 1.0; // minimum intra-zone distance
  const key1 = `${zoneA}-${zoneB}`;
  const key2 = `${zoneB}-${zoneA}`;
  return DISTANCE_MATRIX_KM[key1] || DISTANCE_MATRIX_KM[key2] || 5.0;
}

/**
 * Matching Rule:
 * Two ride requests (or an existing pool + new request) are pool-compatible if:
 * 1. They have identical pickup zones (e.g. both pick up at Banani Road 11),
 *    OR pickups are adjacent within the same corridor.
 * 2. Their dropoffs are in compatible corridors or along the same direction.
 * 
 * Case in Point:
 * Nusrat: Banani -> Mohakhali
 * Rafiq:  Banani -> Gulshan 1
 * Both start at BANANI, dropoffs are within NORTH_CENTRAL corridor (< 3km apart).
 * -> 100% Compatible!
 */
export function areRidesPoolCompatible(reqA, reqB) {
  // 1. Same pickup zone is highest compatibility
  const samePickup = reqA.pickupZone === reqB.pickupZone;
  
  // 2. Corridors
  const dropoffCorridorA = DHAKA_ZONES[reqA.dropoffZone]?.corridor;
  const dropoffCorridorB = DHAKA_ZONES[reqB.dropoffZone]?.corridor;
  const compatibleDropoff = dropoffCorridorA === dropoffCorridorB;

  // 3. Dropoffs distance must be reasonable (< 4km detour)
  const dropoffDetourKm = getZoneDistanceKm(reqA.dropoffZone, reqB.dropoffZone);

  return (samePickup && compatibleDropoff) || (samePickup && dropoffDetourKm <= 4.0);
}
