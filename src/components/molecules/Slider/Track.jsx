import { SliderTrack } from "@radix-ui/react-slider";
import { cva } from "class-variance-authority";
import { cn } from "../../../lib/style-utils";

const track = cva(
  ["relative", "grow", "rounded-[10px]", "border", "border-hairline", "bg-surface", "cursor-pointer"],
  {
    variants: {
      orientation: {
        horizontal: ["h-10", "w-full"],
        vertical: ["h-full", "w-10"],
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  }
);

const Track = ({ className, children, orientation, ref, ...props }) => {
  return (
    <SliderTrack ref={ref} className={cn(track({ orientation }), className)} {...props}>
      {children}
    </SliderTrack>
  );
};

export { Track };
