import { cn } from "../../../lib/style-utils";

const Chip = ({ className, children }) => {
  return (
    <span
      className={cn(
        "absolute flex h-4 items-center justify-center rounded-[5px] border border-white/35 bg-ruler-chip font-display text-[10px] whitespace-nowrap text-ink",
        "group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-accent",
        className
      )}
    >
      {children}
    </span>
  );
};

export { Chip };
