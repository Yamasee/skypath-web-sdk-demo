import { forwardRef } from "react";
import { Root, Track, Range, Division, Thumb } from "../molecules/Slider";

const NUMBER_OF_TICKS = 13;

const NowcastingDivisionLabel = ({ children }) => (
  <div className="absolute translate-y-6">{children}</div>
);
const NowcastingDivisionTick = () => (
  <div className="w-0.5 h-1 bg-sky-950"></div>
);

const NowcastingSlider = forwardRef(({ ...props }, ref) => {
  const getLabel = (i) => {
    return (
      <NowcastingDivisionLabel>
        {i === 0
          ? ("Now")
          : (<>+{i}<span className="text-xs">h</span></>)
        }
      </NowcastingDivisionLabel>
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
                customTick={<NowcastingDivisionTick />}
                customLabel={getLabel(i)}
              />
            )),
        ]}
      </Track>
      <Thumb size="sm" />
    </Root>
  );
});

NowcastingSlider.displayName = "NowcastingSlider";

export {NowcastingSlider};
