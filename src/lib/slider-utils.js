import { normalizeAltitude } from "./general-utils";

export const toPercent = (value, min, max) => ((value - min) / (max - min)) * 100;

const edgeAlign = (value, min, max) => {
  if (value === min) return "start";
  if (value === max) return "end";
  return "center";
};

export const getAltitudeScale = ({ min, max }) => {
  const ticks = [];
  const labels = [];

  for (let level = min; level <= max; level += 1) {
    const position = toPercent(level, min, max);
    ticks.push({ position, size: level % 5 === 0 ? "major" : "minor" });

    if (level % 10 === 0) {
      labels.push({ position, text: String(normalizeAltitude(level)), align: edgeAlign(level, min, max) });
    }
  }

  return { ticks, labels };
};

export const formatForecastHour = (hour) => (hour === 0 ? "Now" : `+${hour}h`);

export const getForecastScale = ({ min, max }) => {
  const ticks = [];
  const labels = [];

  for (let halfHours = min * 2; halfHours <= max * 2; halfHours += 1) {
    const hour = halfHours / 2;
    const position = toPercent(hour, min, max);
    const isLabelled = halfHours % 6 === 0;
    const isHour = halfHours % 2 === 0;

    ticks.push({ position, size: isLabelled ? "major" : isHour ? "minor" : "micro" });

    if (isLabelled) {
      labels.push({
        hour,
        position,
        text: formatForecastHour(hour),
        align: edgeAlign(hour, min, max),
        highlighted: hour === 0,
      });
    }
  }

  return { ticks, labels };
};

export const shiftRange = (values, delta, min, max) => {
  const low = Math.min(...values);
  const high = Math.max(...values);
  const shift = Math.max(min - low, Math.min(max - high, delta));

  return values.map((value) => value + shift);
};

// The thumb shows the selected hour itself, so the scale label under it is dropped instead of half-covered
export const withoutCoveredLabels = (labels, hour, reach = 1) =>
  labels.filter((label) => Math.abs(label.hour - hour) >= reach);
