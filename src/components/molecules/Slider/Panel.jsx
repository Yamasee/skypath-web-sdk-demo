import { cva } from "class-variance-authority";
import { cn } from "../../../lib/style-utils";

const panel = cva([
  "bg-slate-500/30",
  "flex flex-col",
  "items-center",
  "justify-start",
  "pt-5",
  "rounded-lg",
  "h-[80px]",
  "px-9",
  "text-white",
  "shadow-light",
  "backdrop-blur-md",
  "border",
  "border-slate-400",
  "border-opacity-30",
]);

const Panel = ({
  children,
  className,
  width = "450px",
  style,
  ...props
}) => {
  return (
    <div
      className={cn(panel(), className)}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export { Panel };