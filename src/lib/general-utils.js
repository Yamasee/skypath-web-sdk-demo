const ALTITUDE_MULTIPLIER = 10;

export const normalizeAltitude = (value) => {
  return value * ALTITUDE_MULTIPLIER;
};

export const formatAltitude = (value) => {
  return `FL${normalizeAltitude(value)}`;
}

// Check if map is ready
export const checkMapIsReady = (map) => map?.loaded();

export const groupByHexIdAndSelectMostSevere = ({ hexagons }) => {
  return hexagons.reduce((acc, hexagon) => {
    const { hexId, sev, alt, observationTime } = hexagon;
    if (!acc[hexId] || acc[hexId].sev < sev) {
      acc[hexId] = { hexId, sev, alt, observationTime };
    }
    return acc;
  }, {});
};