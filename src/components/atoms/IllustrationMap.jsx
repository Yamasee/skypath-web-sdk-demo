import { memo } from "react";
import { PREVIEW_HEX_POINTS } from "../../lib/preview-clusters";

const AIRCRAFT_PATH =
  "M11 1.6c.7 0 1.15.87 1.15 1.93v4.86l7.25 4.22v1.88l-7.25-2.16v4.31l2.1 1.6v1.2L11 18.52l-3.25.92v-1.2l2.1-1.6v-4.31L2.6 14.49v-1.88l7.25-4.22V3.53c0-1.06.45-1.93 1.15-1.93z";

const AIRPORT_PATH =
  "M2.5 19h19v2h-19v-2zm19.57-9.36c-.21-.8-1.04-1.28-1.84-1.06L14.92 10l-6.9-6.43-1.93.51 4.14 7.17-4.97 1.33-1.97-1.54-1.45.39 2.59 4.49L21 11.49c.81-.23 1.28-1.05 1.07-1.85z";

const ClusterLayer = memo(function ClusterLayer({ clusters }) {
  return clusters.map((cluster) => (
    <g key={cluster.id} transform={cluster.transform} opacity={cluster.opacity} className="transition-opacity duration-500 ease-out">
      {cluster.hexes.map(({ key, x, y, fill, core }) => (
        <g key={key}>
          <use href="#h" x={x} y={y} fill={fill} />
          {core && <use href="#h" transform={core.transform} fill={core.fill} />}
        </g>
      ))}
    </g>
  ));
});

const IllustrationMap = ({ frame, clusters }) => {
  const { worldTransform, tiles, viewport, trail, ahead, aheadDashOffset, aircraft } = frame;

  return (
    <svg viewBox="0 0 848 868" preserveAspectRatio="xMidYMid slice" aria-hidden="true" className="absolute inset-0 block size-full">
      <defs>
        <pattern id="grid" width="44" height="44" patternUnits="userSpaceOnUse">
          <path d="M44 0H0V44" fill="none" stroke="rgba(255,255,255,.045)" strokeWidth="1" />
        </pattern>
        <radialGradient id="vig" cx="50%" cy="50%" r="75%">
          <stop offset="55%" stopColor="#0D0D0D" stopOpacity="0" />
          <stop offset="100%" stopColor="#0D0D0D" stopOpacity=".85" />
        </radialGradient>
        <polygon id="h" points={PREVIEW_HEX_POINTS} />
      </defs>
      <g transform={worldTransform}>
        <g className="[filter:saturate(.3)_brightness(.6)_contrast(1.05)]">
          {tiles.map((tile) => (
            <image key={tile.key} href={tile.href} x={tile.x} y={tile.y} width={tile.size + 0.5} height={tile.size + 0.5} />
          ))}
        </g>
        <rect {...viewport} fill="#0D0D0D" fillOpacity=".25" />
        <rect {...viewport} fill="url(#grid)" />

        <ClusterLayer clusters={clusters} />

        <polyline points={trail} fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points={ahead} fill="none" stroke="rgba(255,255,255,.7)" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 6" strokeDashoffset={aheadDashOffset} />

        <circle r="13" fill="#111213" stroke="#FFFFFF" strokeWidth="1.5" />
        <path transform="translate(-7.5 -8) scale(.62)" d={AIRPORT_PATH} fill="#FFFFFF" />
      </g>

      <g transform={`translate(${aircraft.x} ${aircraft.y})`}>
        <circle r="56" fill="rgba(255,255,255,.035)" stroke="rgba(255,255,255,.5)" strokeDasharray="3 4" />
        <circle r="23" fill="rgba(200,206,204,.26)" stroke="rgba(255,255,255,.25)" />
        <path transform={`rotate(${aircraft.heading}) translate(-11 -11)`} d={AIRCRAFT_PATH} fill="#FFFFFF" />
      </g>

      <rect width="848" height="868" fill="url(#vig)" pointerEvents="none" />
    </svg>
  );
};

export { IllustrationMap };
