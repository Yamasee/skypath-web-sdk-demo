import {
  ALTITUDE_SLIDER_CONFIG,
  FORECAST_SLIDER_CONFIG,
  AIRCRAFT_CATEGORY_OPTIONS,
  SEVERITY_OPTIONS,
  HOURS_OPTIONS,
} from "../../config";
import { AltitudeSlider } from "./AltitudeSlider";
import { ForecastSlider } from "./ForecastSlider";
import { Divider } from "../atoms/Divider";
import Dropdown from "../atoms/Dropdown";
import { PlayButton } from "../molecules/PlayButton";
import SeverityToggle from "../molecules/SeverityToggle";
import useForecastPlayback from "../../hooks/general/useForecastPlayback";

const MapControls = ({
  selectedAltitude,
  handleAltitudeChange,
  selectedForecast,
  setSelectedForecast,
  selectedMinSeverity,
  setSelectedMinSeverity,
  aircraftCategory,
  setAircraftCategory,
  hours,
  setHours,
}) => {
  const { isPlaying, togglePlayback } = useForecastPlayback({
    setSelectedForecast,
    min: FORECAST_SLIDER_CONFIG.min,
    max: FORECAST_SLIDER_CONFIG.max,
  });

  return (
    <>
      <aside
        aria-label="Altitude and filters"
        className="absolute top-[124px] right-7 bottom-[124px] z-10 flex max-h-[660px] w-[76px] flex-col items-center gap-2.5 rounded-full border border-hairline bg-panel pt-2.5 pb-[18px] select-none"
      >
        <Dropdown
          label="Aircraft category"
          options={AIRCRAFT_CATEGORY_OPTIONS}
          value={aircraftCategory}
          onChange={setAircraftCategory}
        />
        <Dropdown label="History window" options={HOURS_OPTIONS} value={hours} onChange={setHours} />
        <Divider className="w-10" />
        <AltitudeSlider
          {...ALTITUDE_SLIDER_CONFIG}
          className="min-h-0 grow"
          value={selectedAltitude}
          onValueChange={handleAltitudeChange}
        />
      </aside>

      <div className="absolute right-7 bottom-6 left-7 z-10 flex gap-2 select-none">
        <section
          aria-label="Forecast time"
          className="flex h-[76px] min-w-0 grow items-center gap-4 rounded-[26px] border border-hairline bg-panel pr-6 pl-3"
        >
          <PlayButton isPlaying={isPlaying} onClick={togglePlayback} />
          <ForecastSlider
            {...FORECAST_SLIDER_CONFIG}
            value={[selectedForecast]}
            onValueChange={([value]) => setSelectedForecast(value)}
          />
        </section>
        <SeverityToggle
          options={SEVERITY_OPTIONS}
          value={selectedMinSeverity}
          onChange={setSelectedMinSeverity}
        />
      </div>
    </>
  );
};

export { MapControls };
