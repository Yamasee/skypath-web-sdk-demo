import { PREVIEW_CLUSTER_ALTITUDE, PREVIEW_CLUSTER_KINDS, PREVIEW_HEX_RADIUS, PREVIEW_HEX_STYLES } from "./preview-data";

const HEX_WIDTH = Math.sqrt(3) * PREVIEW_HEX_RADIUS;
const HEX_ROW = 1.5 * PREVIEW_HEX_RADIUS;
const NEIGHBOURS = [
  [1, 0],
  [1, -1],
  [0, -1],
  [-1, 0],
  [-1, 1],
  [0, 1],
];

export const createRandom = (initialSeed) => {
  let seed = initialSeed >>> 0;
  const next = () => {
    seed = (seed + 0x6d2b79f5) >>> 0;
    let t = seed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    next,
    between: (min, max) => min + (max - min) * next(),
    integer: (min, max) => Math.floor(min + (max - min + 1) * next()),
    pick: (items) => items[Math.floor(next() * items.length)],
    weighted: (weights) => {
      const entries = Object.entries(weights);
      let roll = next() * entries.reduce((sum, [, weight]) => sum + weight, 0);
      const found = entries.find(([, weight]) => (roll -= weight) <= 0);
      return found ? found[0] : entries[entries.length - 1][0];
    },
    seed: () => seed,
  };
};

export const PREVIEW_HEX_POINTS = [0, 1, 2, 3, 4, 5]
  .map((corner) => {
    const angle = (Math.PI / 3) * corner - Math.PI / 2;
    return `${(PREVIEW_HEX_RADIUS * Math.cos(angle)).toFixed(2)},${(PREVIEW_HEX_RADIUS * Math.sin(angle)).toFixed(2)}`;
  })
  .join(" ");

const toKey = ([q, r]) => `${q},${r}`;
const step = ([q, r], [dq, dr]) => [q + dq, r + dr];
const hexDistance = ([q, r]) => (Math.abs(q) + Math.abs(r) + Math.abs(q + r)) / 2;

const growBlob = (random, size) => {
  const cells = new Map([[toKey([0, 0]), [0, 0]]]);
  while (cells.size < size) {
    const next = step(random.pick([...cells.values()]), random.pick(NEIGHBOURS));
    cells.set(toKey(next), next);
  }
  return [...cells.values()];
};

const growScatter = (random, size, { spread, pairChance }) => {
  const cells = new Map();
  while (cells.size < size) {
    const cell = [random.integer(-spread, spread), random.integer(-spread, spread)];
    if (hexDistance(cell) > spread) continue;
    cells.set(toKey(cell), cell);
    if (random.next() < pairChance) {
      const pair = step(cell, random.pick(NEIGHBOURS));
      cells.set(toKey(pair), pair);
    }
  }
  return [...cells.values()];
};

const growTrail = (random, size, { turnChance }) => {
  let direction = random.integer(0, NEIGHBOURS.length - 1);
  let cell = [0, 0];
  const cells = new Map([[toKey(cell), cell]]);
  while (cells.size < size) {
    if (random.next() < turnChance) {
      direction = (direction + (random.next() < 0.5 ? 1 : NEIGHBOURS.length - 1)) % NEIGHBOURS.length;
    }
    cell = step(cell, NEIGHBOURS[direction]);
    cells.set(toKey(cell), cell);
  }
  return [...cells.values()];
};

const GROWTH = { blob: growBlob, scatter: growScatter, trail: growTrail };

const toRgba = ([r, g, b, a]) => `rgba(${r}, ${g}, ${b}, ${(a / 255).toFixed(3)})`;

const toHex = ({ q, r, severity }, style) => {
  const { fills, fallback, ring, core } = PREVIEW_HEX_STYLES[style];
  const [red, green, blue, alpha] = fills[severity] || fallback;
  const x = HEX_WIDTH * (q + r / 2);
  const y = HEX_ROW * r;
  return {
    key: `${q},${r}`,
    x,
    y,
    severity,
    fill: toRgba([red, green, blue, alpha * ring]),
    core: core && { transform: `translate(${x} ${y}) scale(${core})`, fill: toRgba([red, green, blue, alpha]) },
  };
};

export const pickClusterKind = (random) => {
  const weights = Object.fromEntries(PREVIEW_CLUSTER_KINDS.map(({ weight }, index) => [index, weight]));
  return PREVIEW_CLUSTER_KINDS[Number(random.weighted(weights))];
};

export const generateCluster = (random, kind) => {
  const cells = GROWTH[kind.growth](random, random.integer(...kind.size), kind);
  const hexes = cells.map(([q, r]) => toHex({ q, r, severity: Number(random.weighted(kind.severities)) }, kind.style));

  return {
    layer: kind.layer,
    altitude: Math.round(random.between(...PREVIEW_CLUSTER_ALTITUDE)),
    hexes,
  };
};
