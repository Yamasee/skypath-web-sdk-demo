import { forwardRef } from "react";
import { Thumb, Range, Division, Track, Root } from "../molecules/Slider";

const SeveritySlider = forwardRef(({ ...props }, ref) => (
  <Root ref={ref} {...props}>
    <Track>
      <Range />
      {props?.options?.map((option) => <Division key={option.value} label={option.label} />)}
    </Track>
    <Thumb size="sm" />
  </Root>
));

export {SeveritySlider};
