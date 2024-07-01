import { SliderRange } from "@radix-ui/react-slider";

import { cva } from "class-variance-authority";
import { forwardRef } from "react";
import { cn } from "../../../lib/style-utils";

const range = cva(['absolute']);

const Range = forwardRef(({ className, ...props }, ref) => {
  return (
    <SliderRange
      ref={ref}
      className={cn(range(props),className)}
      {...props}
    />
  );
});

Range.displayName = "Range";

export {Range};