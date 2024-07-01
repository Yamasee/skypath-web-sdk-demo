import { forwardRef } from "react";
import { cn } from "../../lib/style-utils";
import { Thumb, Range, Track, Bubble, Root } from "../molecules/Slider";
import { formatAltitude } from "../../lib/general-utils";

const MAJOR_PERIOD = 10;
const NUMBER_OF_DIVISIONS = 51;

const DivisionLabel = ({ value }) => (
  <div className="text-[11px] font-medium absolute left-5 -top-1.5">
    {value}
  </div>
);

const AltitudeSlider = forwardRef(
  ({ className, nowcastingValue, ...props }, ref) => (
    <Root
      ref={ref}
      className={cn("flex-col h-full justify-center my-1.5", className)}
      {...props}
    >
      <Track className="flex-col items-center w-1.5 bg-slate-800 py-0.5">
        {Array.from({ length: NUMBER_OF_DIVISIONS })
          .map((_, index) => {
            const isMajor = index % MAJOR_PERIOD === 0;
            const className = isMajor ? "w-[10px] h-0.5" : "w-1.5 h-[1px]";
            return (
              <div
                key={index}
                className={cn(`
                  text-xs
                  -translate-x-1/2
                  bg-slate-800
                  rounded-sm`,
                  className
                )}
              >
                {isMajor && <DivisionLabel value={index} />}
              </div>
            );
          })
          .reverse()}
        <Range className="w-full bg-blue-500" />
      </Track>
      <Thumb orientation="horizontal" size="lg" />
      <Thumb orientation="horizontal" size="md" withDot>
        <Bubble>
          <div className="text-[13px] font-normal">
            {formatAltitude(nowcastingValue)}
          </div>
          <div className="text-[10px] text-[#697888] font-light">Nowcast</div>
        </Bubble>
      </Thumb>
      <Thumb orientation="horizontal" size="lg" />
    </Root>
  )
);

AltitudeSlider.displayName = "AltitudeSlider";

export {AltitudeSlider};
