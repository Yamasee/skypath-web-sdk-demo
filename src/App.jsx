// React
import {useCallback, useMemo, useState } from "react";
// Map
import {Map} from "react-map-gl";
import DeckGL from "@deck.gl/react";
import {GeoJsonLayer} from "deck.gl";
// Components
import {MapControls} from "./components/organisms/MapControls";
// Config
import {
  MAPBOX_TOKEN,
  ALTITUDE_SLIDER_INITIAL_VALUE,
  INITIAL_MAP_STYLE,
  INITIAL_MAP_VIEW_STATE,
  MAP_GEOJSON_LAYER_CONFIG,
  MAP_OBSERVATION_CONFIG,
} from "./config";
// SkyPath SDK
import {CoreUtils, GeoUtils, Nowcasting, Observations} from "@yamasee/skypath-sdk-web";
// Features
import {useNowcastingFlow} from "./hooks/nowcasting/useNowcastingFlow";
import {useNowcastingFiltering} from "./hooks/nowcasting/useNowcastingFiltering";
import { cn } from "./lib/style-utils";
import {useObservationsFlow} from "./hooks/obserbations/useObservationsFlow";
import {useObservationsFiltering} from "./hooks/obserbations/useObservationsFiltering";

const App = ({ sdk }) => {
  const nowcastingFlow = useMemo(() => sdk.createNowcastingFlow(), [sdk]);
  const observationFlow = useMemo(() => sdk.createObservationsFlow(), [sdk]);

  const [map, setMap] = useState(null);
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

  const debouncedAltitudeChange = CoreUtils.debounce(
    (value) => setSelectedAltitudeDebounced(value),
    500
  );

  const [bottomAlt, nowcastingAlt, topAlt] = selectedAltitude;
  const [, nowcastingAltDebounced] = selectedAltitudeDebounced;

  const {
    nowcastingData,
    changeViewState,
    toggle: toggleNowcasting,
    isRunning: isRunningNowcasting,
  } = useNowcastingFlow(
    nowcastingFlow,
    map
  );
  const {
    observationFlowData,
    updateConfig,
    updateMapPolygon,
    toggle: toggleObservations,
    isRunning: isObservationsRunning,
  } = useObservationsFlow(
    observationFlow,
    map
  );

  const { filteredData: filteredNowcastingData } = useNowcastingFiltering(
    nowcastingData,
    {
      selectedSeverity: selectedMinSeverity,
      selectedAltitude: nowcastingAltDebounced,
      selectedForecast,
    }
  );

  const handleMapMove = CoreUtils.debounce(() => {
    updateMapPolygon();
    changeViewState();
  }, 500);

  useObservationsFiltering(updateConfig, {
    aircraftCategory: aircraftCategory,
    hours: hours,
    severity: selectedMinSeverity,
    altitudeFrom: selectedAltitudeDebounced[0],
    altitudeTo: selectedAltitudeDebounced[2],
  });

  const handleLoadMap = useCallback(({ target }) => setMap(target), []);

  const nowcastingFeatureCollection = useMemo(() => {
    const hexagons = Nowcasting.prepareNowcastingDataForMapHexagons({
      data: filteredNowcastingData,
    });
    return GeoUtils.getHexagonsFeatureCollection(hexagons);
  }, [filteredNowcastingData]);

  const observationFeatureCollection = useMemo(() => {
    return GeoUtils.getHexagonsFeatureCollection(observationFlowData);
  }, [observationFlowData]);

  const handleAltitudeChange = useCallback((value) => {
    setSelectedAltitude(value);
    debouncedAltitudeChange(value);
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <DeckGL
        initialViewState={INITIAL_MAP_VIEW_STATE}
        onViewStateChange={handleMapMove}
        controller
        layers={[
          new GeoJsonLayer({
            ...MAP_GEOJSON_LAYER_CONFIG,
            visible: isRunningNowcasting,
            data: nowcastingFeatureCollection,
          }),
          new GeoJsonLayer({
            ...MAP_OBSERVATION_CONFIG,
            visible: isObservationsRunning,
            data: observationFeatureCollection,
          }),
        ]}
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
        setAircraftCategory={setAircraftCategory}
        setHours={setHours}
        hours={hours}
      />
      <div className="absolute z-10 flex flex-col gap-1 p-2 top-2 right-2">
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
        <button
          className={cn(
            "px-2 py-1 bg-white rounded-md",
            isObservationsRunning
              ? "bg-gradient-to-b from-white to-gray-100 text-gray-950"
              : "bg-gray-200 text-gray-400"
          )}
          onClick={toggleObservations}
        >
          Observations
        </button>
      </div>
    </div>
  );
};

export default App;
