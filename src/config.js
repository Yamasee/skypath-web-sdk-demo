import { Observations } from "@skypath-io/web-sdk";

const MAPBOX_TOKEN = 'pk.eyJ1IjoieWFtYXNlZWluYyIsImEiOiJjbGxhdW82YTUwMWFkM2hxdW93NHF4cmVzIn0.c_NnlJUyYSz2lXUBWzDiJQ';

// Initial state
const INITIAL_MAP_VIEW_STATE = {
  longitude: -85,
  latitude: 35,
  zoom: 4.5,
  // maxZoom: 5,
  // minZoom: 2.5,
};

const ALTITUDE_SLIDER_INITIAL_VALUE = [
  Observations.availableConfigInputs.minAltitude, // Floor altitude
  35, // Nowcasting
  Observations.availableConfigInputs.maxAltitude, // Ceiling altitude
];

const SEVERITY_OPTIONS = [
  { value: Observations.availableConfigInputs.severity.smooth, label: 'Smooth' },
  { value: Observations.availableConfigInputs.severity.light, label: 'Light' },
  { value: Observations.availableConfigInputs.severity.light_moderate, label: 'Light-Moderate' },
  { value: Observations.availableConfigInputs.severity.moderate, label: 'Moderate' },
  { value: Observations.availableConfigInputs.severity.severe, label: 'Severe' },
]

const AIRCRAFT_CATEGORY_OPTIONS = [
  { value: Observations.availableConfigInputs.aircraftCategory.C10, label: 'C10' },
  { value: Observations.availableConfigInputs.aircraftCategory.C20, label: 'C20' },
  { value: Observations.availableConfigInputs.aircraftCategory.C30, label: 'C30' },
  { value: Observations.availableConfigInputs.aircraftCategory.C40, label: 'C40' },
  { value: Observations.availableConfigInputs.aircraftCategory.C50, label: 'C50' },
  { value: Observations.availableConfigInputs.aircraftCategory.C60, label: 'C60' },
  { value: Observations.availableConfigInputs.aircraftCategory.C70, label: 'C70' },
  { value: Observations.availableConfigInputs.aircraftCategory.C80, label: 'C80' },
  { value: Observations.availableConfigInputs.aircraftCategory.C90, label: 'C90' },
  { value: Observations.availableConfigInputs.aircraftCategory.C100, label: 'C100' },
  { value: Observations.availableConfigInputs.aircraftCategory.C110, label: 'C110' },
]

const HOURS_OPTIONS = [
  { value: Observations.availableConfigInputs.hours.halfAnHour, label: '1/2h' },
  { value: Observations.availableConfigInputs.hours.oneHour, label: '1h' },
  { value: Observations.availableConfigInputs.hours.twoHours, label: '2h' },
  { value: Observations.availableConfigInputs.hours.threeHours, label: '3h' },
  { value: Observations.availableConfigInputs.hours.fourHours, label: '4h' },
]

// Default configurations
const ALTITUDE_SLIDER_CONFIG = {
  min: 5,
  max: 50,
  step: 1,
  minStepsBetweenThumbs: 3,
};
// dark
const INITIAL_MAP_STYLE = "mapbox://styles/mapbox/dark-v9";
const DEFAULT_DEBOUNCE_TIME = 500;
// Map layers configurations
const MAP_GEOJSON_LAYER_CONFIG = {
  id: "geojson-layer",
  wrapLongitude: true,
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
  wrapLongitude: true,
  extruded: false,
  filled: true,
  getElevation: 1000,
  billboard: true,
  sizeMinPixels: 0.1,
  sizeMaxPixels: 1.5,
  stroked: true,
  lineWidthMinPixels: 1,
  getLineColor: () => [100, 100, 100, 100],
  getPolygonOffset: () => [0, 0],
  getFillColor: (d) => {
    const severityColorMap = {
      0: [255, 250, 250, 100],
      1: [255, 234, 0, 200],
      2: [255, 193, 50, 200],
      3: [255, 146, 16, 200],
      4: [248, 70, 14, 200],
      5: [248, 70, 14, 200],
    };
    return severityColorMap[d.properties.sev];
  },
  pickable: true,
  autoHighlight: true,
};
const MAP_ONELAYER_CONFIG = {
  id: 'oneLayer',
  wrapLongitude: true,
  extruded: false,
  filled: true,
  getElevation: 1000,
  billboard: true,
  sizeMinPixels: 0.1,
  sizeMaxPixels: 1.5,
  getFillColor: (d) => {
    const severityColorMap = {
      0: [255, 250, 250, 100],
      1: [255, 234, 0, 200],
      2: [255, 193, 50, 200],
      3: [255, 146, 16, 200],
      4: [248, 70, 14, 200],
      5: [248, 70, 14, 200],
    };
    return severityColorMap[d.properties.sev];
  },
  stroked: true,
  getLineColor: [128, 128, 128, 128],
  lineWidthScale: 2,
  getLineWidth: 200,
  lineWidthUnits: 'meters',
  pickable: true,
  autoHighlight: true,
  highlightColor: [173, 224, 244, 220],
};
const MAP_EQUATOR_CONFIG = {
  id: "equator-layer",
  wrapLongitude: true,
  stroked: true,
  filled: false,
  getLineColor: [255, 255, 255, 50],
  lineWidthMinPixels: 1,
  getLineWidth: 2,
  data: {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: [
        [-180, 0],
        [180, 0],
      ],
    },
    properties: {},
  },
};
const MAP_ADSB_MIDDLE_CONFIG = {
  id: 'adsb-layer-middle',
  wrapLongitude: true,
  extruded: false,
  filled: true,
  getElevation: 1000,
  billboard: true,
  sizeMinPixels: 0.1,
  sizeMaxPixels: 1.5,
  stroked: true,
  lineWidthMinPixels: 1,
  getLineColor: () => [100, 100, 100, 100],
  getPolygonOffset: () => [0, 0],
  getFillColor: (d) => {
    const severityColorMap = {
      0: [255, 250, 250, 100],
      1: [255, 234, 0, 200],
      2: [255, 193, 50, 200],
      3: [255, 146, 16, 200],
      4: [248, 70, 14, 200],
      5: [248, 70, 14, 200],
    };
    return severityColorMap[d.properties.sev];
  },
  pickable: true,
  autoHighlight: true,
};
const MAP_ADSB_RING_CONFIG = {
  id: "adsb-layer-ring",
  wrapLongitude: true,
  extruded: false,
  filled: false,
  getElevation: 1000,
  billboard: true,
  sizeMinPixels: 0.1,
  sizeMaxPixels: 1.5,
  stroked: true,
  lineWidthMinPixels: 1,
  getLineColor: () => [100, 100, 100, 100],
  getPolygonOffset: () => [0, 0],
};
const MAP_H3_LAYER_CONFIG = {
  id: "h3-layer",
  wrapLongitude: true,
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
  MAPBOX_TOKEN,
  INITIAL_MAP_VIEW_STATE,
  INITIAL_MAP_STYLE,
  MAP_GEOJSON_LAYER_CONFIG,
  MAP_OBSERVATION_CONFIG,
  MAP_ONELAYER_CONFIG,
  MAP_H3_LAYER_CONFIG,
  DEFAULT_DEBOUNCE_TIME,
  ALTITUDE_SLIDER_CONFIG,
  ALTITUDE_SLIDER_INITIAL_VALUE,
  HOURS_OPTIONS,
  SEVERITY_OPTIONS,
  AIRCRAFT_CATEGORY_OPTIONS,
  MAP_ADSB_RING_CONFIG,
  MAP_ADSB_MIDDLE_CONFIG,
  MAP_EQUATOR_CONFIG,
};
