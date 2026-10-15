import * as Tabs from "@radix-ui/react-tabs";
import { AUTH_OPTIONS } from "../../../lib/validation/authSchemas";

const OPTIONS = [
  { value: AUTH_OPTIONS.API_KEY, label: "API key" },
  { value: AUTH_OPTIONS.SIGNED_JWT, label: "Signed JWT" },
];

const AuthOptions = () => {
  return (
    <Tabs.List aria-label="Authorization option" className="flex gap-1 self-start rounded-full bg-surface p-1">
      {OPTIONS.map((option) => (
        <Tabs.Trigger
          key={option.value}
          value={option.value}
          className="h-9 cursor-pointer rounded-full px-[18px] text-[13px] font-semibold text-ink-muted transition-colors hover:text-ink data-[state=active]:bg-chip-active data-[state=active]:text-ink"
        >
          {option.label}
        </Tabs.Trigger>
      ))}
    </Tabs.List>
  );
};

export default AuthOptions;
