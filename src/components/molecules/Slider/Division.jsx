import { cva } from "class-variance-authority";
import { forwardRef } from "react";
import { cn } from "../../../lib/style-utils";

const division = cva([
  "relative",
  "flex",
  "flex-row",
  "justify-evenly",
  "items-center",
  "text-sm",
]);

const divisionLabel = cva([
  "absolute",
  "translate-y-6",
]);

const divisionTick = cva([
  "w-0.5",
  "h-1",
  "bg-slate-800",
]);

const Division = forwardRef(({
  className,
  customLabel,
  customTick,
  label,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(division(props), className)}
      {...props}
    >
      {customLabel || <div className={divisionLabel()}>{label}</div>}
      {customTick || <div className={divisionTick()}></div>}
    </div>
  );
});

export {Division};
