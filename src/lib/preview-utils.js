import {
  PREVIEW_CLUSTERS,
  PREVIEW_FLIGHT,
  PREVIEW_HIDDEN_OPACITY,
  PREVIEW_LAYER_FLOWS,
  PREVIEW_MAP,
  PREVIEW_VIEW,
} from "./preview-data";
import { createRandom, generateCluster, pickClusterKind } from "./preview-clusters";

const BASE = [Math.cos(PREVIEW_FLIGHT.baseHeading), Math.sin(PREVIEW_FLIGHT.baseHeading)];
const NORMAL = [-BASE[1], BASE[0]];
const STEP = PREVIEW_FLIGHT.speed * PREVIEW_FLIGHT.routeStep;
const ROUTE_LENGTH = PREVIEW_FLIGHT.speed * PREVIEW_FLIGHT.routeSeconds;
const ROUTE_POINTS = Math.ceil(ROUTE_LENGTH / STEP);

const dot = ([ax, ay], [bx, by]) => ax * bx + ay * by;
const fromFrame = (along, lateral) => [BASE[0] * along + NORMAL[0] * lateral, BASE[1] * along + NORMAL[1] * lateral];
const wrapAngle = (angle) => Math.atan2(Math.sin(angle), Math.cos(angle));
const toDegrees = (radians) => (radians * 180) / Math.PI;
const modulo = (value, size) => ((value % size) + size) % size;

const isClusterVisible = ({ layer, altitude }, { activeLayer, altitude: [low, , high] }) =>
  PREVIEW_LAYER_FLOWS[activeLayer].includes(layer) && altitude >= low && altitude <= high;

const getHazards = (clusters, filters) =>
  clusters
    .filter((cluster) => isClusterVisible(cluster, filters))
    .flatMap(({ center, hexes }) =>
      hexes
        .filter(({ severity }) => severity > 0)
        .map(({ x, y }) => {
          const point = [center[0] + x, center[1] + y];
          return { along: dot(point, BASE), lateral: dot(point, NORMAL) };
        })
    );

const getNearbyHazards = (hazards, along) =>
  hazards.filter((hazard) => Math.abs(hazard.along - along) < PREVIEW_FLIGHT.avoidReach * 2);

const isBlocked = (hazards, lateral) => hazards.find((hazard) => Math.abs(hazard.lateral - lateral) < PREVIEW_FLIGHT.avoidClearance);

const getClearLateral = (hazards, along, lateral) => {
  const ahead = hazards.filter(
    (hazard) => hazard.along > along - PREVIEW_FLIGHT.avoidBehind && hazard.along < along + PREVIEW_FLIGHT.avoidReach
  );
  let low = 0;
  let high = 0;
  for (let hit = isBlocked(ahead, low); hit; hit = isBlocked(ahead, low)) low = hit.lateral - PREVIEW_FLIGHT.avoidClearance - 1;
  for (let hit = isBlocked(ahead, high); hit; hit = isBlocked(ahead, high)) high = hit.lateral + PREVIEW_FLIGHT.avoidClearance + 1;
  return Math.abs(lateral - low) < Math.abs(lateral - high) ? low : high;
};

const headingAt = (route, index) => {
  if (route.length < 2) return PREVIEW_FLIGHT.baseHeading;
  const to = Math.min(Math.max(1, index), route.length - 1);
  const [x0, y0] = route[to - 1];
  const [x1, y1] = route[to];
  return Math.atan2(y1 - y0, x1 - x0);
};

const planRoute = (start, clusters, filters) => {
  const hazards = getHazards(clusters, filters);
  const smoothing = 1 - Math.exp(-PREVIEW_FLIGHT.turnResponse * PREVIEW_FLIGHT.routeStep);
  const route = [...start];
  let heading = headingAt(route, route.length - 1);
  let nearby = getNearbyHazards(hazards, dot(route[route.length - 1], BASE));

  while (route.length < ROUTE_POINTS) {
    const pos = route[route.length - 1];
    const along = dot(pos, BASE);
    if (route.length % PREVIEW_FLIGHT.obstacleRefresh === 0) nearby = getNearbyHazards(hazards, along);
    const [tx, ty] = fromFrame(along + PREVIEW_FLIGHT.steerDistance, getClearLateral(nearby, along, dot(pos, NORMAL)));
    heading += wrapAngle(Math.atan2(ty - pos[1], tx - pos[0]) - heading) * smoothing;
    route.push([pos[0] + Math.cos(heading) * STEP, pos[1] + Math.sin(heading) * STEP]);
  }
  return route;
};


export const createPreviewWorld = (seed, filters) => {
  const random = createRandom(seed);
  const count = Math.ceil(ROUTE_LENGTH / PREVIEW_CLUSTERS.spacing);
  const clusters = Array.from({ length: count }, (_, id) => {
    const kind = pickClusterKind(random);
    const along = PREVIEW_CLUSTERS.first + id * PREVIEW_CLUSTERS.spacing;
    return { id, center: fromFrame(along, random.between(-kind.lateral, kind.lateral)), ...generateCluster(random, kind) };
  });

  return { clusters, route: planRoute([[0, 0]], clusters, filters) };
};

export const replanPreviewRoute = (world, distance, filters) => ({
  ...world,
  route: planRoute(world.route.slice(0, Math.floor(distance / STEP) + 1), world.clusters, filters),
});

export const advancePreviewDistance = (distance, seconds) =>
  (distance + PREVIEW_FLIGHT.speed * Math.min(Math.max(seconds, 0), PREVIEW_FLIGHT.maxFrameSeconds)) % (ROUTE_LENGTH - STEP * 2);

export const getPreviewHour = (distance, { min, max }) =>
  min + (((distance / PREVIEW_FLIGHT.speed) * PREVIEW_FLIGHT.hoursPerSecond) % (max - min));

export const getPreviewCullDistance = (distance) =>
  Math.floor(distance / PREVIEW_CLUSTERS.cullStep) * PREVIEW_CLUSTERS.cullStep;

const getPosition = (route, distance) => {
  const index = Math.floor(distance / STEP);
  const [x0, y0] = route[index];
  const [x1, y1] = route[index + 1];
  const t = distance / STEP - index;
  return { index, pos: [x0 + (x1 - x0) * t, y0 + (y1 - y0) * t] };
};

const toPoints = (points) => points.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ");

const toWorldPixels = ({ lat, lon }, zoom, tileSize) => {
  const scale = tileSize * 2 ** zoom;
  const sin = Math.sin((lat * Math.PI) / 180);
  return [((lon + 180) / 360) * scale, (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * scale];
};

const MAP_ORIGIN = toWorldPixels(PREVIEW_MAP.start, PREVIEW_MAP.zoom, PREVIEW_MAP.tileSize);

const getMapTiles = ([left, top]) => {
  const { tileSize, zoom, tileUrl } = PREVIEW_MAP;
  const tileCount = 2 ** zoom;
  const [x, y] = [MAP_ORIGIN[0] + left, MAP_ORIGIN[1] + top];
  const rows = [Math.max(0, Math.floor(y / tileSize)), Math.min(tileCount - 1, Math.floor((y + PREVIEW_VIEW.height) / tileSize))];
  const columns = [Math.floor(x / tileSize), Math.floor((x + PREVIEW_VIEW.width) / tileSize)];
  const tiles = [];

  for (let row = rows[0]; row <= rows[1]; row += 1) {
    for (let column = columns[0]; column <= columns[1]; column += 1) {
      tiles.push({
        key: `${column}-${row}`,
        href: tileUrl.replace("{z}", zoom).replace("{y}", row).replace("{x}", modulo(column, tileCount)),
        x: column * tileSize - MAP_ORIGIN[0],
        y: row * tileSize - MAP_ORIGIN[1],
        size: tileSize,
      });
    }
  }
  return tiles;
};

export const getPreviewFrame = ({ route }, distance) => {
  const { index, pos } = getPosition(route, distance);
  const [screenX, screenY] = PREVIEW_FLIGHT.screen;
  const corner = [pos[0] - screenX, pos[1] - screenY];

  return {
    worldTransform: `translate(${-corner[0]} ${-corner[1]})`,
    tiles: getMapTiles(corner),
    viewport: { x: corner[0], y: corner[1], width: PREVIEW_VIEW.width, height: PREVIEW_VIEW.height },
    trail: toPoints([...route.slice(Math.max(0, index - PREVIEW_FLIGHT.trailPoints), index + 1), pos]),
    ahead: toPoints([pos, ...route.slice(index + 1, index + 1 + PREVIEW_FLIGHT.aheadPoints)]),
    aheadDashOffset: distance % PREVIEW_FLIGHT.dashPeriod,
    aircraft: {
      x: screenX,
      y: screenY,
      heading: toDegrees(headingAt(route, index + 1)) + PREVIEW_FLIGHT.aircraftHeadingOffset,
    },
  };
};

export const getPreviewClusters = ({ route, clusters }, distance, filters) => {
  const { pos } = getPosition(route, distance);
  return clusters
    .filter(({ center }) => Math.hypot(center[0] - pos[0], center[1] - pos[1]) < PREVIEW_CLUSTERS.cullRadius)
    .map((cluster) => ({
      id: cluster.id,
      transform: `translate(${cluster.center[0]} ${cluster.center[1]})`,
      hexes: cluster.hexes,
      opacity: isClusterVisible(cluster, filters) ? 1 : PREVIEW_HIDDEN_OPACITY,
    }));
};
