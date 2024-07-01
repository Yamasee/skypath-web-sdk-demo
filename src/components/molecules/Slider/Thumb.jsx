import { forwardRef } from "react";
import { cva } from "class-variance-authority";
import { SliderThumb } from "@radix-ui/react-slider";
import { cn } from "../../../lib/style-utils";

const thumb = cva(
  [
    "flex",
    "bg-white",
    "rounded-sm",
    "shadow",
    "cursor-grab",
    "focus-visible:outline-none",
    "disabled:pointer-events-none",
    "disabled:opacity-50",
    "relative",
  ],
  {
    variants: {
      orientation: {
        horizontal: "aspect-[11/3]",
        vertical: "aspect-[3/11]",
      },
      withDot: {
        true: [
          "after:absolute",
          "after:inset-0",
          "after:w-1",
          "after:aspect-square",
          "after:bg-blue-500",
          "after:rounded-full",
          "after:left-1/2",
          "after:top-1/2",
          "after:-translate-y-1/2",
          "after:-translate-x-1/2",
        ],
      },
      size: {
        sm: "w-1.5",
        md: "w-2",
        lg: "w-2.5",
      },
    },
    compoundVariants: [
      {
        orientation: "horizontal",
        size: "sm",
        className: "h-1.5 w-auto",
      },
      {
        orientation: "horizontal",
        size: "md",
        className: "h-2 w-auto",
      },
      {
        orientation: "horizontal",
        size: "lg",
        className: "h-2.5 w-auto",
      },
    ],
    defaultVariants: {
      orientation: "vertical",
      size: "md",
      withDot: false,
    },
  }
);

const Thumb = forwardRef(({
  className,
  children,
  withDot,
  ...props
}, ref) => {
  return (
    <SliderThumb ref={ref} className={cn(thumb({...props, withDot}), className)} {...props}>
      {children}
    </SliderThumb>
  );
});

Thumb.displayName = "Thumb";

export {Thumb};