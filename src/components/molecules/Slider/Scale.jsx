import { cva } from "class-variance-authority";
import { cn } from "../../../lib/style-utils";

const tick = cva(["absolute", "bg-white/16"], {
  variants: {
    orientation: {
      horizontal: ["bottom-0", "w-px"],
      vertical: ["right-0", "h-px"],
    },
    size: {
      major: ["bg-white/40"],
      minor: [],
      micro: [],
    },
  },
  compoundVariants: [
    { orientation: "horizontal", size: "major", className: "h-2" },
    { orientation: "horizontal", size: "minor", className: "h-[5px]" },
    { orientation: "horizontal", size: "micro", className: "h-[3px]" },
    { orientation: "vertical", size: "major", className: "w-2" },
    { orientation: "vertical", size: "minor", className: "w-1" },
    { orientation: "vertical", size: "micro", className: "w-1" },
  ],
});

const label = cva(
  ["absolute", "font-display", "text-[9.5px]", "leading-3", "whitespace-nowrap", "text-ink-muted"],
  {
    variants: {
      orientation: {
        horizontal: ["bottom-[11px]"],
        vertical: ["right-3"],
      },
      align: {
        start: [],
        center: [],
        end: [],
      },
      highlighted: {
        true: ["text-ink"],
      },
    },
    compoundVariants: [
      { orientation: "horizontal", align: "start", className: "translate-x-1" },
      { orientation: "horizontal", align: "center", className: "-translate-x-1/2" },
      { orientation: "horizontal", align: "end", className: "-translate-x-[calc(100%+4px)]" },
      { orientation: "vertical", align: "start", className: "translate-y-0" },
      { orientation: "vertical", align: "center", className: "translate-y-1/2" },
      { orientation: "vertical", align: "end", className: "translate-y-full" },
    ],
  }
);

const positionStyle = (orientation, position) =>
  orientation === "vertical" ? { bottom: `${position}%` } : { left: `${position}%` };

// Labels sit under the window, the ticks above it: the opaque window hides the labels it covers
const ScaleLabels = ({ orientation, labels }) => (
  <div className="pointer-events-none absolute inset-0" aria-hidden="true">
    {labels.map((item) => (
      <span
        key={item.position}
        className={label({ orientation, align: item.align, highlighted: item.highlighted })}
        style={positionStyle(orientation, item.position)}
      >
        {item.text}
      </span>
    ))}
  </div>
);

const ScaleTicks = ({ orientation, ticks, className }) => (
  <div className={cn("pointer-events-none absolute inset-0", className)} aria-hidden="true">
    {ticks.map((item) => (
      <span
        key={item.position}
        className={tick({ orientation, size: item.size })}
        style={positionStyle(orientation, item.position)}
      ></span>
    ))}
  </div>
);

export { ScaleLabels, ScaleTicks };
