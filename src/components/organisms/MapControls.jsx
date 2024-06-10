import { ALTITUDE_SLIDER_CONFIG } from "../../config";
import { AltitudeSlider } from "./AltitudeSlider";
import { SeveritySlider } from "./SeveritySlider";
import { NowcastingSlider } from "./NowcastingSlider";
import { Panel as SliderPanel } from "../molecules/Slider/Panel";
import { AltitudeDisplay } from "../atoms/AltitudeDisplay";
import { Divider } from "../atoms/Divider";
import { AltRangeDisplay } from "../atoms/AltitudeRangeDisplay";
import Dropdown from "../atoms/Dropdown";

const severityOptions = [
  { value: 0, label: "Smooth" },
  { value: 1, label: "Light" },
  { value: 2, label: "Light-Moderate" },
  { value: 3, label: "Moderate" },
  { value: 4, label: "Severe" },
];
const aircraftCategoryOptions = [
  { value: "C10", label: "C10" },
  { value: "C20", label: "C20" },
  { value: "C30", label: "C30" },
  { value: "C40", label: "C40" },
  { value: "C50", label: "C50" },
  { value: "C60", label: "C60" },
  { value: "C70", label: "C70" },
  { value: "C80", label: "C80" },
  { value: "C90", label: "C90" },
  { value: "C100", label: "C100" },
  { value: "C110", label: "C110" },
];

const hoursOptions = [
  { value: "0.5", label: "0.5h" },
  { value: "1", label: "1h" },
  { value: "2", label: "2h" },
  { value: "3", label: "3h" },
  { value: "4", label: "4h" },
  { value: "5", label: "5h" },
  { value: "6", label: "6h" },
];

const BottomPanelsContainer = ({ children }) => {
  return (
    <div className="absolute flex flex-row flex-wrap items-center justify-center w-full gap-5 -translate-x-1/2 bottom-5 left-1/2">
      {children}
    </div>
  );
};

const MapControls = ({
  selectedAltitude,
  handleAltitudeChange,
  selectedForecast,
  setSelectedForecast,
  selectedMinSeverity,
  setSelectedMinSeverity,
  bottomAlt,
  nowcastingAlt,
  topAlt,
  setAircraftCategory,
  setHours,
}) => {
  return (
    <>
      <div
        className="
        select-none
        absolute
        bg-slate-500/30
        p-2
        top-1/2
        right-5
        h-[450px]
        w-[70px]
        -translate-y-1/2
        shadow-light
        rounded-xl
        backdrop-blur-md
        flex
        flex-col
        gap-1.5
        items-center"
      >
        <Dropdown
          options={aircraftCategoryOptions}
          onChange={setAircraftCategory}
          defaultValue="C60"
        />
        <Dropdown options={hoursOptions} onChange={setHours} defaultValue="2" />
        <AltRangeDisplay bottomAlt={bottomAlt} topAlt={topAlt} />
        <Divider />
        <AltitudeDisplay value={topAlt} />
        <AltitudeSlider
          {...ALTITUDE_SLIDER_CONFIG}
          value={selectedAltitude}
          onValueChange={handleAltitudeChange}
          orientation="vertical"
          nowcastingValue={nowcastingAlt}
        />
        <AltitudeDisplay value={bottomAlt} />
      </div>
      <BottomPanelsContainer>
        <SliderPanel>
          <NowcastingSlider
            value={[selectedForecast]}
            onValueChange={([value]) => setSelectedForecast(value)}
            min={0}
            max={6}
          />
        </SliderPanel>
        <SliderPanel>
          <SeveritySlider
            value={[selectedMinSeverity]}
            onValueChange={([value]) => setSelectedMinSeverity(value)}
            options={severityOptions}
            min={0}
            max={4}
          />
        </SliderPanel>
      </BottomPanelsContainer>
    </>
  );
};

export { MapControls };
