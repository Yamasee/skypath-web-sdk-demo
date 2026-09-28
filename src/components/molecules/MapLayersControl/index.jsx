import * as Toggle from "@radix-ui/react-toggle";
import * as Tooltip from "@radix-ui/react-tooltip";
import { cn } from "../../../lib/style-utils";
import { Icon } from "../../atoms/Icon";

const LayerToggle = ({ name, isOn, onToggle, isNested, isDisabled, isLocked }) => (
  <Toggle.Root
    pressed={isOn && !isDisabled}
    onPressedChange={onToggle}
    disabled={isDisabled}
    className={cn(
      "inline-flex h-9 cursor-pointer items-center gap-2 rounded-full border px-3.5 text-[12.5px] font-semibold whitespace-nowrap transition-colors",
      "border-hairline bg-[rgba(18,20,21,.88)] text-ink-secondary hover:text-ink",
      "data-[state=on]:border-hairline-strong data-[state=on]:bg-[rgba(60,64,66,.85)] data-[state=on]:text-ink",
      "disabled:cursor-not-allowed disabled:text-ink-disabled disabled:hover:text-ink-disabled",
      isNested && "-ml-0.5 h-[30px] text-[11.5px]"
    )}
  >
    {isLocked ? (
      <Icon name="lock" size={11} />
    ) : (
      <span
        className={cn(
          "size-1.5 rounded-full",
          isOn && !isDisabled ? "bg-accent" : "bg-white/25"
        )}
      ></span>
    )}
    {name}
  </Toggle.Root>
);

const MapLayersControl = ({ toggles }) => {
  return (
    <Tooltip.Provider delayDuration={150}>
      <nav aria-label="Layers" className="flex items-center gap-1.5">
        {toggles.map((toggle) =>
          toggle.hint ? (
            <Tooltip.Root key={toggle.name}>
              <Tooltip.Trigger asChild>
                <span tabIndex={0} className="rounded-full">
                  <LayerToggle {...toggle} />
                </span>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  side="bottom"
                  sideOffset={8}
                  className="z-50 rounded-xl border border-hairline bg-surface px-3 py-2 text-xs font-medium text-ink-secondary shadow-glass"
                >
                  {toggle.hint}
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          ) : (
            <LayerToggle key={toggle.name} {...toggle} />
          )
        )}
      </nav>
    </Tooltip.Provider>
  );
};

export default MapLayersControl;
