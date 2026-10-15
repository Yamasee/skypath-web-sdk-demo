import { MAP_LAYERS } from "./constants";
import { FORECAST_DEFAULT_COLOR, FORECAST_SEVERITY_COLORS, MAPBOX_TOKEN, SEVERITY_COLORS } from "../config";

export const PREVIEW_HEX_RADIUS = 10;

export const PREVIEW_HEX_STYLES = {
  observed: { fills: SEVERITY_COLORS, fallback: SEVERITY_COLORS[0], ring: 0.6, core: 0.6 },
  forecast: { fills: FORECAST_SEVERITY_COLORS, fallback: FORECAST_DEFAULT_COLOR, ring: 1, core: null },
};

export const PREVIEW_LAYERS = [MAP_LAYERS.ONE_LAYER, MAP_LAYERS.FORECAST, MAP_LAYERS.ADSB];
export const PREVIEW_HIDDEN_OPACITY = 0.07;

export const PREVIEW_LAYER_FLOWS = {
  [MAP_LAYERS.ONE_LAYER]: [MAP_LAYERS.ONE_LAYER, MAP_LAYERS.OBSERVATIONS, MAP_LAYERS.FORECAST, MAP_LAYERS.ADSB],
  [MAP_LAYERS.FORECAST]: [MAP_LAYERS.FORECAST],
  [MAP_LAYERS.ADSB]: [MAP_LAYERS.ADSB],
};

export const PREVIEW_VIEW = { width: 848, height: 868 };

export const PREVIEW_FLIGHT = {
  screen: [424, 434],
  baseHeading: -Math.PI / 18,
  speed: 23,
  routeSeconds: 1800,
  routeStep: 1 / 6,
  turnResponse: 6,
  avoidClearance: 22,
  avoidBehind: 60,
  avoidReach: 500,
  steerDistance: 60,
  obstacleRefresh: 20,
  hoursPerSecond: 0.3,
  trailPoints: 240,
  aheadPoints: 270,
  maxFrameSeconds: 0.1,
  aircraftHeadingOffset: 90,
  dashPeriod: 9,
};

export const PREVIEW_CLUSTERS = { first: 240, spacing: 170, cullRadius: 900, cullStep: 200 };
export const PREVIEW_CLUSTER_ALTITUDE = [22, 38];

export const PREVIEW_CLUSTER_KINDS = [
  {
    layer: MAP_LAYERS.FORECAST,
    style: "forecast",
    growth: "blob",
    weight: 0.2,
    size: [18, 42],
    lateral: 70,
    severities: { 2: 0.85, 3: 0.12, 4: 0.03 },
  },
  {
    layer: MAP_LAYERS.OBSERVATIONS,
    style: "observed",
    growth: "scatter",
    weight: 0.35,
    size: [7, 16],
    spread: 4,
    pairChance: 0.4,
    lateral: 70,
    severities: { 0: 0.2, 1: 0.45, 2: 0.2, 3: 0.1, 4: 0.05 },
  },
  {
    layer: MAP_LAYERS.ADSB,
    style: "observed",
    growth: "trail",
    weight: 0.45,
    size: [12, 26],
    turnChance: 0.3,
    lateral: 260,
    severities: { 0: 0.9, 1: 0.07, 2: 0.03 },
  },
];

export const PREVIEW_MAP = {
  tileUrl: `https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}@2x.jpg90?access_token=${MAPBOX_TOKEN}`,
  attribution: "© Mapbox © Maxar",
  filter: "brightness(0.66) saturate(0.2)",
  tileSize: 256,
  zoom: 7,
  start: { lat: 45.5, lon: 1.5 },
};
