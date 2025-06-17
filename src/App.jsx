import { cn } from "./lib/style-utils";
import { MapControls } from "./components/organisms/MapControls";
import MapLayersControl from "./components/molecules/MapLayersControl";
import MapView from "./components/organisms/MapView";
import {
  MAPBOX_TOKEN,
  INITIAL_MAP_STYLE,
  INITIAL_MAP_VIEW_STATE,
} from "./config";
import useMapLayers from "./hooks/general/useMapLayers";
import useMapState from "./hooks/general/useMapState";

const App = ({ sdk }) => {
  const {
    map,
    polygon, 
    setPolygon,
    mapIsReady,
    selectedForecast,
    setSelectedForecast,
    selectedMinSeverity,
    setSelectedMinSeverity,
    aircraftCategory,
    hours,
    setHours,
    selectedAltitude,
    selectedAltitudeDebounced,
    bottomAlt,
    nowcastingAlt,
    topAlt,
    handleLoadMap,
    handleSetAircraftCategory,
    handleAltitudeChange
  } = useMapState();

  const {
    layers,
    isLoadingLayers,
    layerControls
  } = useMapLayers({
    sdk, 
    polygon, 
    options: {
      selectedMinSeverity,
      selectedAltitudeDebounced,
      hours,
      nowcastingAlt,
      aircraftCategory,
      selectedForecast,
    }
  });

  const {
    isRunningNowcasting,
    toggleNowcasting,
    isAdsbRunning,
    toggleAdsbLayer,
    isRunningObservations,
    toggleObservations,
    isOneLayerRunning,
    toggleOneLayer
  } = layerControls;

  return (
    <div className={cn("relative w-screen h-screen overflow-hidden border-4 border-[#191a1a]", isLoadingLayers && 'border-red-500')}>
      <MapView 
        map={map}
        mapIsReady={mapIsReady}
        initialViewState={INITIAL_MAP_VIEW_STATE}
        mapStyle={INITIAL_MAP_STYLE}
        mapboxToken={MAPBOX_TOKEN}
        layers={layers}
        onLoadMap={handleLoadMap}
        setPolygon={setPolygon}
      />
      <MapControls
        selectedAltitude={selectedAltitude}
        handleAltitudeChange={handleAltitudeChange}
        selectedForecast={selectedForecast}
        setSelectedForecast={setSelectedForecast}
        selectedMinSeverity={selectedMinSeverity}
        setSelectedMinSeverity={setSelectedMinSeverity}
        bottomAlt={bottomAlt}
        nowcastingAlt={nowcastingAlt}
        topAlt={topAlt}
        aircraftCategory={aircraftCategory}
        setAircraftCategory={handleSetAircraftCategory}
        setHours={setHours}
        hours={hours}
      />
      <MapLayersControl 
        isRunningNowcasting={isRunningNowcasting}
        toggleNowcasting={toggleNowcasting}
        isAdsbRunning={isAdsbRunning}
        toggleAdsbLayer={toggleAdsbLayer}
        isRunningObservations={isRunningObservations}
        toggleObservations={toggleObservations}
        isOneLayerRunning={isOneLayerRunning}
        toggleOneLayer={toggleOneLayer}
      />
    </div>
  );
};

export default App;
