import { getDistance } from 'geolib';

/**
 * Calculates the distance between two latitude-longitude points using `geolib`
 * @param source - Object containing source latitude and longitude
 * @param destination - Object containing destination latitude and longitude
 * @returns Distance in kilometers (km)
 */
export const getDistanceBetweenCoordinates = (
  source: { latitude: number; longitude: number },
  destination: { latitude: number; longitude: number }
): number => {
  const distanceInMeters = getDistance(source, destination);
  return distanceInMeters / 1000; // Convert meters to KM
};
