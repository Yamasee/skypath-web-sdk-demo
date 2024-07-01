import { forwardRef } from "react";
import { SliderTrack } from "@radix-ui/react-slider";

import { cva } from "class-variance-authority";
import { cn } from "../../../lib/style-utils";

const range = cva([
  "relative",
  "flex",
  "flex-row",
  "justify-between",
  "relative",
  "h-1.5",
  "w-full",
  "bg-gray-600",
  "grow",
  "rounded-full",
  "pointer-events-none",
]);

const Track = forwardRef(({ className, children, ...props }, ref) => {
  return (
    <SliderTrack ref={ref} className={cn(range(props), className)} {...props}>
      {children}
    </SliderTrack>
  );
});

Track.displayName = "Track";

export {Track};
