import { forwardRef } from "react";
import { Thumb, Range, Division, Track, Root } from "../molecules/Slider";

const SeveritySlider = forwardRef(({ ...props }, ref) => (
  <Root ref={ref} {...props}>
    <Track>
      <Range />
      <Division label="Light" />
      <Division label="Moderate" />
      <Division label="Severe" />
    </Track>
    <Thumb size="sm" />
  </Root>
));

export {SeveritySlider};
