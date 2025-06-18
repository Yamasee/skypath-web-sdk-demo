import { cn } from "../../../lib/style-utils";
import { MAP_LAYERS } from "../../../lib/constants";

const LayerToggleButton = ({ name, isRunning, onClick }) => (
  <button
    className={cn(
      "px-2 py-1 rounded-md w-full transition-colors",
      isRunning
        ? "bg-gradient-to-b from-white to-gray-100 text-gray-950"
        : "bg-gray-200 text-gray-400 hover:bg-gray-300"
    )}
    onClick={onClick}
  >
    {name}
  </button>
);

const MapLayersControl = ({ 
  isRunningNowcasting,
  toggleNowcasting,
  isAdsbRunning,
  toggleAdsbLayer,
  isRunningObservations,
  toggleObservations,
  isOneLayerRunning,
  toggleOneLayer
}) => {
  const layerControls = [
    {
      name: MAP_LAYERS.NOWCASTING,
      isRunning: isRunningNowcasting,
      toggle: toggleNowcasting,
      top: "0.5em"
    },
    {
      name: MAP_LAYERS.ADSB,
      isRunning: isAdsbRunning,
      toggle: toggleAdsbLayer,
      top: "3em"
    },
    {
      name: MAP_LAYERS.OBSERVATIONS,
      isRunning: isRunningObservations,
      toggle: toggleObservations,
      top: "5.5em"
    },
    {
      name: MAP_LAYERS.ONE_LAYER,
      isRunning: isOneLayerRunning,
      toggle: toggleOneLayer,
      top: "8em"
    }
  ];

  return (
    <>
      {layerControls.map((control) => (
        <div 
          key={control.name}
          className="absolute z-10 flex flex-col gap-1 p-2 right-2 w-[9em]" 
          style={{ top: control.top }}
        >
          <LayerToggleButton 
            name={control.name}
            isRunning={control.isRunning}
            onClick={control.toggle}
          />
        </div>
      ))}
    </>
  );
};

export default MapLayersControl; 