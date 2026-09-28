import { cn } from "../../lib/style-utils";

const CAP = "absolute -right-[1.5px] size-1 bg-accent";

// Two-tone headline with the cursor bar: a 1px line with square caps closing the highlighted line
const CursorHeadline = ({ muted, highlighted, className, surface = "#151515" }) => {
  return (
    <h1 className={cn("m-0 font-display text-[60px] leading-[1.08] font-light tracking-[-0.03em]", className)}>
      <span className="block text-[#7C7C7C]">{muted}</span>
      <span
        className="relative -ml-12 inline-block pr-[22px] pb-1.5 pl-12"
        style={{ background: `linear-gradient(90deg, transparent 0%, ${surface} 38%)` }}
      >
        {highlighted}
        <span className="absolute top-2 right-0 bottom-2 w-px bg-accent"></span>
        <span className={cn(CAP, "top-1")}></span>
        <span className={cn(CAP, "bottom-1")}></span>
      </span>
    </h1>
  );
};

export { CursorHeadline };
