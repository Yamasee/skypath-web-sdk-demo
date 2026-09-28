import { Logo } from "../atoms/Logo";
import { Badge } from "../atoms/Badge";
import SeverityLegend from "../molecules/SeverityLegend";

const MapHeader = ({ sdkVersion, severityOptions }) => {
  return (
    <header className="pointer-events-none absolute top-6 left-7 z-10 flex flex-col gap-[22px]">
      <div className="flex items-center gap-3">
        <Logo />
        <Badge label="SDK" value={`v${sdkVersion}`} className="h-6 text-[11px]" />
      </div>
      <div>
        <h1 className="m-0 font-display text-[44px] leading-[1.05] font-light tracking-[-0.025em]">
          Live turbulence <span className="text-[#7C7C7C]">· in view</span>
        </h1>
        <p className="mt-2.5 mb-0 text-[12.5px] text-ink-muted">
          Layers load for the visible map area and refresh as you pan.
        </p>
      </div>
      <SeverityLegend options={severityOptions} />
    </header>
  );
};

export { MapHeader };
