import { SliderRange } from "@radix-ui/react-slider";
import { cn } from "../../../lib/style-utils";

const Range = ({ className, ...props }) => {
  return <SliderRange className={cn("absolute", className)} {...props} />;
};

export { Range };
