import { MapControls } from "./components/organisms/MapControls";
import { MapHeader } from "./components/organisms/MapHeader";
import MapLayersControl from "./components/molecules/MapLayersControl";
import LoadingIndicator from "./components/molecules/LoadingIndicator";
import MapView from "./components/organisms/MapView";
import {
  MAPBOX_TOKEN,
  INITIAL_MAP_STYLE,
  INITIAL_MAP_VIEW_STATE,
  SEVERITY_OPTIONS,
} from "./config";
import useMapLayers from "./hooks/general/useMapLayers";
import useMapState from "./hooks/general/useMapState";
import useLayerToggles from "./hooks/general/useLayerToggles";

const App = ({ sdk, sdkVersion, onLogout }) => {
  const mapState = useMapState();
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
    forecastAlt,
    handleLoadMap,
    handleSetAircraftCategory,
    handleAltitudeChange,
    isOnelayerForecastEnabled,
    setIsOnelayerForecastEnabled
  } = mapState;

  const {
    layers,
    loadingLayerNames,
    layerControls
  } = useMapLayers({
    sdk,
    polygon,
    options: {
      selectedMinSeverity,
      selectedAltitudeDebounced,
      hours,
      forecastAlt,
      aircraftCategory,
      selectedForecast,
      isOnelayerForecastEnabled,
    }
  });

  const toggleOnelayerForecast = () => {
    if (!layerControls.isOneLayerRunning) {
      return;
    }

    setIsOnelayerForecastEnabled((state) => !state);
  };

  const layerToggles = useLayerToggles({
    sdk,
    layerControls,
    isOnelayerForecastEnabled,
    toggleOnelayerForecast,
  });

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-page">
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
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(11,12,13,.85)_0%,rgba(11,12,13,0)_22%,rgba(11,12,13,0)_80%,rgba(11,12,13,.8)_100%)]"></div>
      <MapHeader sdkVersion={sdkVersion} onLogout={onLogout} severityOptions={SEVERITY_OPTIONS.slice(1)} />
      <div className="absolute top-6 right-7 z-10 flex flex-col items-end gap-3">
        <MapLayersControl toggles={layerToggles} />
        {loadingLayerNames.length > 0 && (
          <LoadingIndicator layerNames={loadingLayerNames.join(", ")} />
        )}
      </div>
      <MapControls
        selectedAltitude={selectedAltitude}
        handleAltitudeChange={handleAltitudeChange}
        selectedForecast={selectedForecast}
        setSelectedForecast={setSelectedForecast}
        selectedMinSeverity={selectedMinSeverity}
        setSelectedMinSeverity={setSelectedMinSeverity}
        aircraftCategory={aircraftCategory}
        setAircraftCategory={handleSetAircraftCategory}
        setHours={setHours}
        hours={hours}
      />
    </div>
  );
};

export default App;
