import { cn } from "../../../lib/style-utils";

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
      name: "Nowcasting",
      isRunning: isRunningNowcasting,
      toggle: toggleNowcasting,
      top: "0.5em"
    },
    {
      name: "ADSB",
      isRunning: isAdsbRunning,
      toggle: toggleAdsbLayer,
      top: "3em"
    },
    {
      name: "Observations",
      isRunning: isRunningObservations,
      toggle: toggleObservations,
      top: "5.5em"
    },
    {
      name: "OneLayer",
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
          <button
            className={cn(
              "px-2 py-1 rounded-md",
              control.isRunning
                ? "bg-gradient-to-b from-white to-gray-100 text-gray-950"
                : "bg-gray-200 text-gray-400"
            )}
            onClick={control.toggle}
          >
            {control.name}
          </button>
        </div>
      ))}
    </>
  );
};

export default MapLayersControl; 