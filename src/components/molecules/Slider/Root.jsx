import { Root as SliderRoot } from "@radix-ui/react-slider";
import { cva } from "class-variance-authority";
import { cn } from "../../../lib/style-utils";

const root = cva(
  ["relative", "flex", "touch-none", "select-none", "data-disabled:pointer-events-none"],
  {
    variants: {
      orientation: {
        horizontal: ["h-10", "w-full", "items-center"],
        vertical: ["h-full", "w-10", "flex-col", "items-center"],
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  }
);

const Root = ({ className, children, orientation = "horizontal", ...props }) => {
  return (
    <SliderRoot
      className={cn(root({ orientation }), className)}
      orientation={orientation}
      {...props}
    >
      {children}
    </SliderRoot>
  );
};

export { Root };
