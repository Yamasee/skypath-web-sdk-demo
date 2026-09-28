import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { cn } from "../../../lib/style-utils";
import { SeverityDot } from "../../atoms/SeverityDot";

const SeverityToggle = ({ options, value, onChange }) => {
  const handleValueChange = (next) => {
    if (next === "") return;
    onChange(Number(next));
  };

  return (
    <div className="flex h-[76px] shrink-0 items-center gap-3.5 rounded-[26px] border border-hairline bg-panel pr-3 pl-5">
      <span className="text-[11.5px] font-medium whitespace-nowrap text-ink-secondary">From</span>
      <ToggleGroup.Root
        type="single"
        aria-label="Minimum severity"
        value={String(value)}
        onValueChange={handleValueChange}
        className="flex grow gap-1 rounded-full bg-ruler-chip p-1"
      >
        {options.map((option) => {
          const isBelow = option.value < value;
          return (
            <ToggleGroup.Item
              key={option.value}
              value={String(option.value)}
              title={option.label}
              className={cn(
                "inline-flex h-[38px] grow cursor-pointer items-center justify-center gap-1.5 rounded-full px-3 text-xs font-semibold whitespace-nowrap transition-colors",
                "data-[state=on]:bg-chip-active data-[state=on]:text-ink",
                isBelow ? "text-ink-disabled" : "text-ink-secondary hover:text-ink"
              )}
            >
              <SeverityDot severity={option.value} className={cn(isBelow && "opacity-35")} />
              {option.shortLabel}
            </ToggleGroup.Item>
          );
        })}
      </ToggleGroup.Root>
    </div>
  );
};

export default SeverityToggle;
