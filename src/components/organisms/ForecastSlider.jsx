import { forwardRef } from "react";
import { Root, Track, Range, Division, Thumb } from "../molecules/Slider";

const NUMBER_OF_TICKS = 24;

const ForecastDivisionLabel = ({ children }) => (
  <div className="absolute translate-y-6">{children}</div>
);
const ForecastDivisionTick = () => (
  <div className="w-0.5 h-1 bg-sky-950"></div>
);

const ForecastSlider = forwardRef(({ ...props }, ref) => {
  const getLabel = (i) => {
    return (
      <ForecastDivisionLabel>
        {i === 0
          ? ("Now")
          : (<>+{i}<span className="text-xs">h</span></>)
        }
      </ForecastDivisionLabel>
    );
  };

  return (
    <Root ref={ref} {...props}>
      <Track>
        <Range />
        {[
          Array(NUMBER_OF_TICKS)
            .fill()
            .map((_, i) => (
              <Division
                key={i}
                customTick={<ForecastDivisionTick />}
                customLabel={getLabel(i)}
              />
            )),
        ]}
      </Track>
      <Thumb size="sm" />
    </Root>
  );
});

ForecastSlider.displayName = "ForecastSlider";

export {ForecastSlider};
