import { IllustrationMap } from "../atoms/IllustrationMap";
import { AltitudeSlider } from "./AltitudeSlider";
import { ForecastSlider } from "./ForecastSlider";
import { PlayButton } from "../molecules/PlayButton";
import { ALTITUDE_SLIDER_CONFIG, FORECAST_SLIDER_CONFIG } from "../../config";
import { PREVIEW_MAP } from "../../lib/preview-data";
import useLoginPreview from "../../hooks/general/useLoginPreview";
import { cn } from "../../lib/style-utils";

const LoginPreview = () => {
  const {
    layers,
    activeLayer,
    onLayerChange,
    altitude,
    onAltitudeChange,
    forecastValue,
    isPlaying,
    togglePlayback,
    frame,
    clusters,
  } = useLoginPreview();

  return (
    <section
      aria-label="What the demo shows"
      className="relative hidden grow overflow-hidden rounded-[28px] bg-[#111213] lg:block"
    >
      <IllustrationMap frame={frame} clusters={clusters} />

      <div className="absolute top-7 right-[116px] left-8 flex gap-1.5">
        {layers.map((name) => (
          <button
            key={name}
            type="button"
            aria-pressed={name === activeLayer}
            onClick={() => onLayerChange(name)}
            className={cn(
              "inline-flex h-8 cursor-pointer items-center rounded-full border px-3.5 text-xs font-medium transition-colors",
              name === activeLayer
                ? "border-hairline-strong bg-[rgba(60,64,66,.72)]"
                : "border-hairline bg-[rgba(18,20,21,.86)] text-ink-secondary hover:text-ink",
            )}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="absolute top-0 right-0 bottom-[76px] flex w-[84px] flex-col items-center py-6">
        <AltitudeSlider {...ALTITUDE_SLIDER_CONFIG} value={altitude} onValueChange={onAltitudeChange} />
      </div>

      <div className="absolute inset-x-0 bottom-0 flex h-[76px] items-center gap-4 pr-8 pl-4">
        <PlayButton isPlaying={isPlaying} onClick={togglePlayback} />
        <ForecastSlider {...FORECAST_SLIDER_CONFIG} value={forecastValue} disabled />
      </div>
      <span className="absolute right-[92px] bottom-[82px] text-[9px] text-white/40">{PREVIEW_MAP.attribution}</span>
    </section>
  );
};

export { LoginPreview };
