// React
import { useCallback, useEffect, useMemo, useState } from "react";
// Utils
import { cn } from "./lib/style-utils";
// Map
import { Map } from "react-map-gl";
import DeckGL from "@deck.gl/react";
import { GeoJsonLayer } from "deck.gl";
// Components
import { MapControls } from "./components/organisms/MapControls";
// Config
import {
  MAPBOX_TOKEN,
  ALTITUDE_SLIDER_INITIAL_VALUE,
  INITIAL_MAP_STYLE,
  INITIAL_MAP_VIEW_STATE,
  MAP_EQUATOR_CONFIG,
} from "./config";
// SkyPath SDK
import {
  CoreUtils,
  GeoUtils,
  Observations,
} from "@skypath-io/web-sdk";
// Features
import useNowcastingFlow from "./hooks/nowcasting/useNowcastingFlow";
import useOneLayerFlow from "./hooks/oneLayer/useOneLayerFlow";
import useAdsbFlow from "./hooks/adsb/useAdsbFlow.js";
import useObservationsFlow from "./hooks/observations/useObservationsFlow.js";

const App = ({ sdk }) => {
  // MAP
  const [map, setMap] = useState(null);
  const [polygon, setPolygon] = useState(null);
  const mapIsReady = useMemo(() => map?.loaded(), [map]);

  // Map configuration
  const [selectedForecast, setSelectedForecast] = useState(0);
  const [selectedMinSeverity, setSelectedMinSeverity] = useState(
    Observations.availableConfigInputs.severity.smooth
  );
  const [aircraftCategory, setAircraftCategory] = useState(
    Observations.availableConfigInputs.aircraftCategory.C60
  );
  const [hours, setHours] = useState(
    Observations.availableConfigInputs.hours.twoHours
  );
  const [selectedAltitudeDebounced, setSelectedAltitudeDebounced] = useState(
    ALTITUDE_SLIDER_INITIAL_VALUE
  );
  const [selectedAltitude, setSelectedAltitude] = useState(
    ALTITUDE_SLIDER_INITIAL_VALUE
  );
  const [bottomAlt, nowcastingAlt, topAlt] = selectedAltitude;

  // Adsb flow
  const {
    layers: adsbLayers,
    toggle: toggleAdsbLayer,
    isProcessing: isAdsbLoading,
    isRunning: isAdsbRunning
  } = useAdsbFlow({sdk , polygon, options: {
    selectedMinSeverity,
    selectedAltitudeDebounced,
    hours,
  }});

  // OneLayer
  const {
    layer: oneLayer,
    toggle: toggleOneLayer,
    isProcessing: isOneLayerLoading,
    isRunning: isOneLayerRunning
  } = useOneLayerFlow({sdk , polygon, options: {
    selectedMinSeverity,
    hours,
    selectedAltitudeDebounced,
    nowcastingAlt,
    aircraftCategory,
    selectedForecast,
  }});

  // Observations
  const {
    layer: observationsLayer,
    toggle: toggleObservations,
    isProcessing: isObservationsLoading,
    isRunning: isRunningObservations,
  } = useObservationsFlow({sdk , polygon, options: {
    selectedMinSeverity,
    hours,
    selectedAltitudeDebounced,
    aircraftCategory,
  }});

  // Nowcasting flow
  const {
    layer: nowcastingLayer,
    toggle: toggleNowcasting,
    isProcessing: isNowcastingLoading,
    isRunning: isRunningNowcasting
  } = useNowcastingFlow({sdk , polygon, options: {
    selectedMinSeverity,
    selectedAltitudeDebounced,
    selectedForecast,
  }});

  // Handlers
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSetSelectedAltitude = useCallback(
    CoreUtils.debounce({ fn: (value) => setSelectedAltitudeDebounced(value), delay: 500 }),
    [setSelectedAltitudeDebounced]
  );

  const handleLoadMap = useCallback(({ target }) => setMap(target), []);
  const handleAltitudeChange = (value) => {
    setSelectedAltitude(value);
    debouncedSetSelectedAltitude(value);
  };
  const handleSetAircraftCategory = (value) => {
    setAircraftCategory(value);
  };

  const handleMapMove = CoreUtils.debounce({ fn: () => {
    if (!mapIsReady) return;
    const currentPolygon = GeoUtils.getMapPolygon({ map });
    setPolygon(currentPolygon);
  },
    delay: 500
  });

  useEffect(() => {
    if (!mapIsReady) return;
    const currentPolygon = GeoUtils.getMapPolygon({ map });
    setPolygon(currentPolygon);

  }, [map, setPolygon, mapIsReady]);

  const layers = [
    new GeoJsonLayer({
      ...MAP_EQUATOR_CONFIG,
    }),
    observationsLayer,
    ...adsbLayers,
    nowcastingLayer,
    oneLayer,
  ]

  const isLoadingLayers = isObservationsLoading || isAdsbLoading || isOneLayerLoading || isNowcastingLoading;

  return (
    <div className={cn("relative w-screen h-screen overflow-hidden border-4 border-[#191a1a]", isLoadingLayers && 'border-red-500')}>
      <DeckGL
        initialViewState={INITIAL_MAP_VIEW_STATE}
        onViewStateChange={handleMapMove}
        controller
        layers={layers}
      >
        <Map
          onLoad={handleLoadMap}
          mapStyle={INITIAL_MAP_STYLE}
          mapboxAccessToken={MAPBOX_TOKEN}
        />
      </DeckGL>
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
      {/* Nowcasting */}
      <div className="absolute z-10 flex flex-col gap-1 p-2 top-[0.5em] right-2 w-[9em]">
        <button
          className={cn(
            "px-2 py-1 rounded-md",
            isRunningNowcasting
              ? "bg-gradient-to-b from-white to-gray-100 text-gray-950"
              : "bg-gray-200 text-gray-400"
          )}
          onClick={toggleNowcasting}
        >
          Nowcasting
        </button>
      </div>
      {/* ADSB */}
      <div className="absolute z-10 flex flex-col gap-1 p-2 top-[3em] right-2 w-[9em]">
        <button
          className={cn(
            "px-2 py-1 rounded-md",
            isAdsbRunning
              ? "bg-gradient-to-b from-white to-gray-100 text-gray-950"
              : "bg-gray-200 text-gray-400"
          )}
          onClick={toggleAdsbLayer}
        >
          ADSB
        </button>
      </div>
      {/* Observations */}
      <div className="absolute z-10 flex flex-col gap-1 p-2 top-[5.5em] right-2 w-[9em]">
        <button
          className={cn(
            "px-2 py-1 rounded-md",
            isRunningObservations
              ? "bg-gradient-to-b from-white to-gray-100 text-gray-950"
              : "bg-gray-200 text-gray-400"
          )}
          onClick={toggleObservations}
        >
          Observations
        </button>
      </div>
      {/* OneLayer */}
      <div className="absolute z-10 flex flex-col gap-1 p-2 top-[8em] right-2 w-[9em]">
        <button
          className={cn(
            "px-2 py-1 rounded-md",
            isOneLayerRunning
              ? "bg-gradient-to-b from-white to-gray-100 text-gray-950"
              : "bg-gray-200 text-gray-400"
          )}
          onClick={toggleOneLayer}
        >
          OneLayer
        </button>
      </div>
    </div>
  );
};

export default App;
