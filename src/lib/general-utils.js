const ALTITUDE_MULTIPLIER = 10;

export const normalizeAltitude = (value) => {
  return value * ALTITUDE_MULTIPLIER;
};

export const formatAltitude = (value) => {
  return `FL${normalizeAltitude(value)}`;
}

// Check if map is ready
export const checkMapIsReady = (map) => map?.loaded();