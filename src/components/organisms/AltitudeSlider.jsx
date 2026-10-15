import { useMemo, useRef } from "react";
import { Root, Track, Range, Thumb, Chip, ScaleLabels, ScaleTicks } from "../molecules/Slider";
import { getAltitudeScale } from "../../lib/slider-utils";
import { normalizeAltitude } from "../../lib/general-utils";
import useRangeDrag from "../../hooks/general/useRangeDrag";

const GRIPS = [0, 1, 2];

const EdgeChip = ({ value }) => (
  <Chip className="left-1/2 w-[42px] -translate-x-1/2 -translate-y-1/2 cursor-ns-resize">
    {normalizeAltitude(value)}
  </Chip>
);

const ForecastMarker = ({ value }) => (
  <span className="absolute right-5 flex -translate-y-1/2 cursor-ns-resize items-center">
    <span className="inline-flex h-[22px] items-center gap-1 rounded-full border border-white/22 bg-ruler-chip px-2.5 whitespace-nowrap group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-accent">
      <span className="text-[9.5px] font-semibold text-ink-muted">FL</span>
      <span className="font-display text-[11.5px] text-ink">{normalizeAltitude(value)}</span>
      <span className="text-[9.5px] font-semibold text-ink-secondary">Forecast</span>
    </span>
    <span className="h-px w-2.5 bg-white/70"></span>
  </span>
);

const AltitudeSlider = ({ className, value, onValueChange, min, max, disabled, ...props }) => {
  const trackRef = useRef(null);
  const scale = useMemo(() => getAltitudeScale({ min, max }), [min, max]);
  const rangeDrag = useRangeDrag({ trackRef, value, onValueChange, min, max, disabled });
  const [floor, forecast, ceiling] = value;

  return (
    <Root
      orientation="vertical"
      className={className}
      value={value}
      onValueChange={onValueChange}
      min={min}
      max={max}
      disabled={disabled}
      {...props}
    >
      <Track ref={trackRef} orientation="vertical">
        <ScaleLabels orientation="vertical" labels={scale.labels} />
        <Range
          className="inset-x-0 flex cursor-grab flex-col items-center justify-center gap-0.5 border-y border-white/80 bg-linear-to-b from-[#3A3A3A] to-[#242424] active:cursor-grabbing"
          {...rangeDrag}
        >
          {GRIPS.map((grip) => (
            <span key={grip} className="h-px w-3 rounded-[1px] bg-white/85"></span>
          ))}
        </Range>
        <ScaleTicks orientation="vertical" ticks={scale.ticks} />
      </Track>
      <Thumb aria-label="Floor altitude">
        <EdgeChip value={floor} />
      </Thumb>
      <Thumb aria-label="Forecast altitude">
        <ForecastMarker value={forecast} />
      </Thumb>
      <Thumb aria-label="Ceiling altitude">
        <EdgeChip value={ceiling} />
      </Thumb>
    </Root>
  );
};

export { AltitudeSlider };
