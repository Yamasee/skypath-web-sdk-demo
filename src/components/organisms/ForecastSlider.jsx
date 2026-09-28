import { useMemo } from "react";
import { Root, Track, Range, Thumb, Chip, ScaleLabels, ScaleTicks } from "../molecules/Slider";
import { formatForecastHour, getForecastScale, withoutCoveredLabels } from "../../lib/slider-utils";

const ForecastSlider = ({ className, value, min, max, ...props }) => {
  const scale = useMemo(() => getForecastScale({ min, max }), [min, max]);
  const [hour] = value;
  const labels = useMemo(() => withoutCoveredLabels(scale.labels, hour), [scale, hour]);

  return (
    <Root className={className} value={value} min={min} max={max} {...props}>
      <Track orientation="horizontal">
        <Range className="inset-y-0 bg-linear-to-r from-white/0 to-white/6" />
        <ScaleLabels orientation="horizontal" labels={labels} />
      </Track>
      <Thumb aria-label="Forecast time">
        <span className="absolute flex h-10 w-4 -translate-1/2 cursor-grab items-center justify-center gap-0.5 border-x border-white/80 bg-linear-to-r from-[#3A3A3A] to-[#242424]">
          <span className="h-3 w-px bg-white/85"></span>
          <span className="h-3 w-px bg-white/85"></span>
        </span>
        <Chip className="-top-5 -translate-1/2 px-[7px]">{formatForecastHour(hour)}</Chip>
      </Thumb>
      <ScaleTicks orientation="horizontal" ticks={scale.ticks} className="inset-px" />
    </Root>
  );
};

export { ForecastSlider };
