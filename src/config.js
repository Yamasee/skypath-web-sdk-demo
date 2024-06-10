// Environment variables
const SKYPATH_API_KEY = import.meta.env.VITE_REACT_SKYPATH_SDK_API_KEY;
const SKYPATH_API_BASE_URL = import.meta.env.VITE_REACT_SKYPATH_SDK_BASE_URL;
const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_REACT_MAPBOX_ACCESS_TOKEN;

// Initial state
const INITIAL_MAP_VIEW_STATE = {
  longitude: -85,
  latitude: 35,
  zoom: 4.5,
  maxZoom: 5,
  minZoom: 3.5,
};
const ALTITUDE_SLIDER_INITIAL_VALUE = [5, 35, 52];

// Default configurations
const ALTITUDE_SLIDER_CONFIG = {
  min: 0,
  max: 50,
  step: 1,
  minStepsBetweenThumbs: 3,
};
const INITIAL_MAP_STYLE = "mapbox://styles/mapbox/streets-v10";
const DEFAULT_DEBOUNCE_TIME = 500;
// Map layers configurations
const MAP_GEOJSON_LAYER_CONFIG = {
  id: "geojson-layer",
  extruded: false,
  filled: true,
  getElevation: 1,
  getFillColor: (data) => {
    const { sev } = data.properties;
    const DEFAULT_COLOR = [0, 0, 0, 255 * 0.4];
    const COLOR_MAPPING = {
      2: [255, 205, 32, 255 * 0.4],
      3: [255, 122, 0, 255 * 0.4],
      4: [249, 66, 10, 255 * 0.4],
    };
    const color = COLOR_MAPPING[sev];
    return color || DEFAULT_COLOR;
  },
  billboard: false,
  sizeMinPixels: 0.1,
  sizeMaxPixels: 1.5,
  pickable: true,
};

const MAP_OBSERVATION_CONFIG = {
  id: "observation",
  xtruded: false,
  filled: true,
  getElevation: 1000,
  billboard: true,
  sizeMinPixels: 0.1,
  sizeMaxPixels: 1.5,
  getPolygonOffset: () => {
    return [0, 0];
  },
  getFillColor: (d) => {
    const severityColorMap = {
      0: [255, 250, 250, 100],
      1: [255, 234, 0, 200],
      2: [255, 193, 50, 200],
      3: [255, 146, 16, 200],
      4: [248, 70, 14, 200],
      5: [248, 70, 14, 200],
      // 5: [255, 0, 205, 230],
    };
    return severityColorMap[d.properties.sev];
  },
  pickable: true,
  autoHighlight: true,
};
const MAP_H3_LAYER_CONFIG = {
  id: "h3-layer",
  extruded: true,
  filled: true,
  getElevation: 1,
  getFillColor: (data) => {
    const { sev } = data;
    const DEFAULT_COLOR = [0, 0, 0, 255 * 0.4];
    const COLOR_MAPPING = {
      2: [255, 205, 32, 255 * 0.4],
      3: [255, 122, 0, 255 * 0.4],
      4: [249, 66, 10, 255 * 0.4],
    };
    const color = COLOR_MAPPING[sev];
    return color || DEFAULT_COLOR;
  },
  getHexagon: (d) => d.hexId,
  wireframe: false,
  opacity: 1,
  billboard: false,
  pickable: true,
};


export {
  SKYPATH_API_KEY,
  SKYPATH_API_BASE_URL,
  MAPBOX_ACCESS_TOKEN,
  INITIAL_MAP_VIEW_STATE,
  INITIAL_MAP_STYLE,
  MAP_GEOJSON_LAYER_CONFIG,
  MAP_OBSERVATION_CONFIG,
  MAP_H3_LAYER_CONFIG,
  DEFAULT_DEBOUNCE_TIME,
  ALTITUDE_SLIDER_CONFIG,
  ALTITUDE_SLIDER_INITIAL_VALUE,
};
