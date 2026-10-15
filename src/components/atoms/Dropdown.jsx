import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Icon } from "./Icon";

const Dropdown = ({ options, value, onChange, label }) => {
  const selected = options.find((item) => item.value === value) || options[0];

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label={label}
          title={label}
          className="inline-flex h-8 w-14 cursor-pointer items-center justify-center gap-0.5 rounded-full bg-chip text-xs font-semibold text-ink outline-none hover:bg-chip-active data-[state=open]:bg-chip-active"
        >
          {selected.label}
          <Icon name="chevronDown" size={10} />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          side="left"
          align="start"
          sideOffset={10}
          className="z-50 min-w-28 rounded-2xl border border-hairline bg-surface p-1.5 shadow-glass"
        >
          <DropdownMenu.Label className="px-2.5 pt-1 pb-1.5 text-[11px] font-medium text-ink-dim">
            {label}
          </DropdownMenu.Label>
          <DropdownMenu.RadioGroup value={value} onValueChange={onChange}>
            {options.map((item) => (
              <DropdownMenu.RadioItem
                key={item.value}
                value={item.value}
                className="flex h-8 cursor-pointer items-center rounded-lg px-2.5 text-[13px] font-medium text-ink-secondary outline-none select-none data-highlighted:bg-chip data-highlighted:text-ink data-[state=checked]:text-ink"
              >
                {item.label}
              </DropdownMenu.RadioItem>
            ))}
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default Dropdown;
