import { formatAltitude } from "./general-utils";
import { MAP_LAYERS, SEVERITY_LABELS, SEVERITY_SWATCHES } from "./constants";

const LAYER_NAMES = {
  "geojson-layer": MAP_LAYERS.FORECAST,
  observation: MAP_LAYERS.OBSERVATIONS,
  oneLayer: MAP_LAYERS.ONE_LAYER,
  "adsb-layer-middle": MAP_LAYERS.ADSB,
  "adsb-layer-ring": MAP_LAYERS.ADSB,
};

const formatRelativeTime = (timestamp) => {
  const minutes = Math.round((Date.now() / 1000 - timestamp) / 60);
  const absolute = Math.abs(minutes);
  const text = absolute < 60 ? `${absolute} min` : `${Math.round(absolute / 60)} h`;
  return minutes >= 0 ? `${text} ago` : `in ${text}`;
};

const row = (label, value) =>
  `<span>${label}</span><span class="font-display text-ink">${value}</span>`;

export const getHexagonTooltip = ({ object, layer }) => {
  const properties = object?.properties;
  if (!properties || !LAYER_NAMES[layer?.id]) return null;

  const { sev, alt, observationTime } = properties;
  const rows = [
    alt !== undefined && row("Altitude", formatAltitude(alt)),
    observationTime && row("Time", formatRelativeTime(observationTime)),
    row("Layer", LAYER_NAMES[layer.id]),
  ].filter(Boolean);

  return {
    className: "deck-tooltip",
    html: `
      <div class="w-[214px] rounded-[18px] border border-white/10 bg-[rgba(40,44,44,.5)] px-4 py-3.5 font-sans text-ink shadow-glass backdrop-blur-[24px]">
        <div class="flex items-center gap-2">
          <span class="size-2 rounded-[2px]" style="background:${SEVERITY_SWATCHES[sev] ?? SEVERITY_SWATCHES[0]}"></span>
          <span class="text-sm font-semibold">${SEVERITY_LABELS[sev] ?? SEVERITY_LABELS[0]}</span>
        </div>
        <div class="mt-3 grid grid-cols-[1fr_auto] gap-x-3 gap-y-1 text-xs text-ink-secondary">${rows.join("")}</div>
      </div>`,
  };
};
