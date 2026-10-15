import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { cn } from "../../../lib/style-utils";
import { SeverityDot } from "../../atoms/SeverityDot";

const SeverityToggle = ({ options, value, onChange }) => {
  const handleValueChange = (next) => {
    if (next === "") return;
    onChange(Number(next));
  };

  return (
    <ToggleGroup.Root
      type="single"
      aria-label="Minimum severity"
      value={String(value)}
      onValueChange={handleValueChange}
      className="flex h-10 shrink-0 items-center gap-1 rounded-lg border border-hairline bg-surface p-1"
    >
      <span className="px-2.5 text-[11.5px] font-medium whitespace-nowrap text-ink-secondary">From</span>
      {options.map((option) => {
        const isBelow = option.value < value;
        return (
          <ToggleGroup.Item
            key={option.value}
            value={String(option.value)}
            title={option.label}
            className={cn(
              "inline-flex h-full grow cursor-pointer items-center justify-center gap-1.5 rounded-md px-3 text-xs font-semibold whitespace-nowrap transition-colors",
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
  );
};

export default SeverityToggle;
