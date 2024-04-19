import { cva } from "class-variance-authority";
import { cn } from "../../../lib/style-utils";

const bubble = cva([
  "absolute",
  "-top-3",
  "-left-16",
  "transform",
  "-translate-x-1/2",
  "text-xs",
  "text-black",
  "font-medium",
  "bg-white",
  "min-w-16",
  "min-h-9",
  "rounded-md",
  "overflow-hidden",
  "pointer-events-none",
  "flex",
  "flex-col",
  "justify-center",
  "leading-none",
  "gap-0.5",
  "items-center",
  "px-2",
  "py-1",
  "border",
  "border-black",
  "shadow-darkest",
]);

const Bubble = ({
  children,
  className,
  ...props
}) => {
  return (
    <div className={cn(bubble(props), className)} {...props}>
      {children}
    </div>
  );
}

export { Bubble };