import { ALTITUDE_SLIDER_CONFIG, AIRCRAFT_CATEGORY_OPTIONS, SEVERITY_OPTIONS, HOURS_OPTIONS } from '../../config';
import {AltitudeSlider} from "./AltitudeSlider";
import {SeveritySlider} from "./SeveritySlider";
import {NowcastingSlider} from "./NowcastingSlider";
import { Panel as SliderPanel } from "../molecules/Slider/Panel";
import { AltitudeDisplay } from "../atoms/AltitudeDisplay";
import { Divider } from "../atoms/Divider";
import { AltRangeDisplay } from '../atoms/AltitudeRangeDisplay';
import Dropdown from "../atoms/Dropdown";

const BottomPanelsContainer = ({ children }) => {
  return (
    <div className="absolute flex flex-row flex-wrap items-center justify-center w-full gap-5 -translate-x-1/2 bottom-12 left-1/2">
      {children}
    </div>
  );
}

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
  aircraftCategory,
  setAircraftCategory,
  hours,
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
        border
      border-slate-400
        border-opacity-30
        flex
        flex-col
        gap-1.5
        items-center"
      >
        <Dropdown options={AIRCRAFT_CATEGORY_OPTIONS} onChange={setAircraftCategory} defaultValue={aircraftCategory} />
        <Dropdown options={HOURS_OPTIONS} onChange={setHours} defaultValue={hours} />
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
            max={12}
          />
        </SliderPanel>
        <SliderPanel>
          <SeveritySlider
            value={[selectedMinSeverity]}
            onValueChange={([value]) => setSelectedMinSeverity(value)}
            options={SEVERITY_OPTIONS}
            min={0}
            max={4}
          />
        </SliderPanel>
      </BottomPanelsContainer>
    </>
  );
}

export {MapControls};