import { IllustrationMap } from "../atoms/IllustrationMap";
import { AltitudeSlider } from "./AltitudeSlider";
import { ForecastSlider } from "./ForecastSlider";
import { PlayButton } from "../molecules/PlayButton";
import { ALTITUDE_SLIDER_CONFIG, FORECAST_SLIDER_CONFIG } from "../../config";
import { MAP_LAYERS } from "../../lib/constants";

const PREVIEW_LAYERS = [MAP_LAYERS.ONE_LAYER, MAP_LAYERS.FORECAST, MAP_LAYERS.ADSB];
const PREVIEW_ALTITUDE = [15, 35, 45];
const PREVIEW_FORECAST = [3];

const FLOWS = [
  { name: "Observations", description: "Live SkyPath turbulence observations" },
  { name: "Forecast", description: "Turbulence prediction, up to 24 h ahead" },
  { name: "OneLayer", description: "Forecast, observations, PIREPs, EDR and ADS-B in one layer" },
  { name: "ADS-B", description: "Observations from ADS-B data" },
];

const noop = () => {};

const LoginPreview = () => {
  return (
    <section
      aria-label="What the demo shows"
      className="relative hidden grow overflow-hidden rounded-[28px] bg-[#111213] lg:block"
      inert
    >
      <IllustrationMap />

      <div className="absolute top-7 right-8 left-8 flex gap-1.5">
        {PREVIEW_LAYERS.map((name, index) => (
          <span
            key={name}
            className={
              index === 0
                ? "inline-flex h-8 items-center rounded-full border border-hairline-strong bg-[rgba(60,64,66,.72)] px-3.5 text-xs font-medium"
                : "inline-flex h-8 items-center rounded-full border border-hairline bg-[rgba(18,20,21,.86)] px-3.5 text-xs font-medium text-ink-secondary"
            }
          >
            {name}
          </span>
        ))}
      </div>

      <div className="absolute top-[84px] right-8 flex h-[332px] w-[76px] flex-col items-center rounded-full border border-hairline bg-panel py-4">
        <AltitudeSlider {...ALTITUDE_SLIDER_CONFIG} value={PREVIEW_ALTITUDE} onValueChange={noop} disabled />
      </div>

      <div className="absolute bottom-[124px] left-8 flex w-[400px] flex-col gap-3.5 rounded-[22px] border border-white/9 bg-[rgba(40,44,44,.46)] px-[22px] py-5 shadow-glass backdrop-blur-[24px]">
        <div className="flex items-baseline justify-between">
          <span className="text-[15px] font-medium">What you will see</span>
          <span className="font-display text-[30px] font-light tracking-[-0.02em]">
            {FLOWS.length}
            <span className="ml-1.5 font-sans text-[11px] font-medium tracking-normal text-ink-secondary">data flows</span>
          </span>
        </div>
        <ul className="m-0 flex list-none flex-col gap-2.5 p-0 text-[12.5px]">
          {FLOWS.map((flow) => (
            <li key={flow.name} className="flex gap-3 border-t border-white/8 pt-2.5">
              <span className="w-24 shrink-0 font-semibold">{flow.name}</span>
              <span className="text-[#B5B5B5]">{flow.description}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="absolute right-8 bottom-8 left-8 flex h-[76px] items-center gap-4 rounded-[26px] border border-hairline bg-panel pr-6 pl-3">
        <PlayButton isPlaying={false} onClick={noop} />
        <ForecastSlider {...FORECAST_SLIDER_CONFIG} value={PREVIEW_FORECAST} disabled />
      </div>
    </section>
  );
};

export { LoginPreview };
