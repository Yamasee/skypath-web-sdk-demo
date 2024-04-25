import { Root as SliderRoot } from "@radix-ui/react-slider";

import { cva } from "class-variance-authority";
import { forwardRef } from "react";
import { cn } from "../../../lib/style-utils";

const root = cva([
  "relative",
  "flex",
  "w-full",
  "cursor-pointer",
  "touch-none",
  "select-none",
  "items-center",
  "h-6",
]);

const Root = forwardRef(({
  className,
  children,
  ...props
}, ref) => {
  return (
    <SliderRoot
      ref={ref}
      className={cn(root(props), className)}
      {...props}
    >
      {children}
    </SliderRoot>
  );
});

export {Root};
