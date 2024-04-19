const ALTITUDE_MULTIPLIER = 10;

export const normalizeAltitude = (value) => {
  return value * ALTITUDE_MULTIPLIER;
};

export const formatAltitude = (value) => {
  return `FL${normalizeAltitude(value)}`;
}