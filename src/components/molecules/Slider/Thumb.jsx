import { SliderThumb } from "@radix-ui/react-slider";
import { cn } from "../../../lib/style-utils";

// Zero-size thumb: Radix keeps it on the exact value (no in-bounds offset), the visible part is its children
const Thumb = ({ className, children, ...props }) => {
  return (
    <SliderThumb className={cn("group block size-0 outline-none", className)} {...props}>
      {children}
    </SliderThumb>
  );
};

export { Thumb };
