import { Logo } from "../atoms/Logo";
import { Badge } from "../atoms/Badge";
import { Icon } from "../atoms/Icon";
import SeverityLegend from "../molecules/SeverityLegend";
import { DOCS_URL } from "../../lib/constants";

const HEADER_ACTION =
  "pointer-events-auto inline-flex h-6 cursor-pointer items-center gap-1 rounded-full bg-surface px-3 text-[11.5px] font-semibold text-ink-muted transition-colors hover:text-ink";

const MapHeader = ({ sdkVersion, onLogout, severityOptions }) => {
  return (
    <header className="pointer-events-none absolute top-6 left-7 z-10 flex flex-col gap-[22px]">
      <div className="flex items-center gap-3">
        <Logo />
        <Badge label="SDK" value={`v${sdkVersion}`} className="h-6 text-[11px]" />
        <a href={DOCS_URL} target="_blank" rel="noopener noreferrer" className={HEADER_ACTION}>
          Docs
          <Icon name="external" size={12} />
        </a>
        <button type="button" onClick={onLogout} className={HEADER_ACTION}>
          <Icon name="logout" size={12} />
          Log out
        </button>
      </div>
      <div>
        <h1 className="m-0 font-display text-[44px] leading-[1.05] font-light tracking-[-0.025em]">
          Live turbulence
        </h1>
      </div>
      <SeverityLegend options={severityOptions} />
    </header>
  );
};

export { MapHeader };
