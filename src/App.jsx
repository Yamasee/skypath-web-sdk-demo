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
  ALTITUDE_SLIDER_INITIAL_VALUE,
  INITIAL_MAP_STYLE,
  INITIAL_MAP_VIEW_STATE,
  MAP_GEOJSON_LAYER_CONFIG,
  MAP_OBSERVATION_CONFIG,
  MAPBOX_ACCESS_TOKEN,
  SKYPATH_API_BASE_URL,
  SKYPATH_API_KEY,
} from "./config";
// SkyPath SDK
import SkyPathSDK, {CoreUtils, GeoUtils, Nowcasting, Observations} from "@yamasee/skypath-sdk-web";
// Features
import {useNowcastingFlow} from "./hooks/nowcasting/useNowcastingFlow";
import {useNowcastingFiltering} from "./hooks/nowcasting/useNowcastingFiltering";
import {useObservationsFlow} from "./hooks/obserbations/useObservationsFlow";
import {useObservationsFiltering} from "./hooks/obserbations/useObservationsFiltering";

const sdk = new SkyPathSDK({
  apiKey: SKYPATH_API_KEY,
  baseUrl: SKYPATH_API_BASE_URL,
});
const nowcastingFlow = sdk.createNowcastingFlow();
const observationFlow = sdk.createObservationsFlow();

const App = () => {
  const [map, setMap] = useState(null);
  const [selectedForecast, setSelectedForecast] = useState(0);
  const [selectedMinSeverity, setSelectedMinSeverity] = useState(Observations.availableConfigInputs.severity.smooth);
  const [aircraftCategory, setAircraftCategory] = useState(Observations.availableConfigInputs.aircraftCategory.C60);
  const [hours, setHours] = useState(Observations.availableConfigInputs.hours.twoHours);
  const [selectedAltitudeDebounced, setSelectedAltitudeDebounced] = useState(ALTITUDE_SLIDER_INITIAL_VALUE);
  const [selectedAltitude, setSelectedAltitude] = useState(ALTITUDE_SLIDER_INITIAL_VALUE);

  const debouncedAltitudeChange = CoreUtils.debounce(
    (value) => setSelectedAltitudeDebounced(value), 500
  );

  const [ bottomAlt, nowcastingAlt, topAlt ] = selectedAltitude;
  const [, nowcastingAltDebounced ] = selectedAltitudeDebounced;

  const { nowcastingData, changeViewState } = useNowcastingFlow(nowcastingFlow, map);
  const { observationFlowData, updateConfig, updateMapPolygon } = useObservationsFlow(observationFlow, map);

  const { filteredData: filteredNowcastingData } = useNowcastingFiltering(nowcastingData, {
    selectedSeverity: selectedMinSeverity,
    selectedAltitude: nowcastingAltDebounced,
    selectedForecast,
  })

  const handleMapMove = CoreUtils.debounce(
      () => {
        updateMapPolygon();
        changeViewState();
      }, 500
    );

  useObservationsFiltering(updateConfig, {
    aircraftCategory: aircraftCategory,
    hours: hours,
    severity: selectedMinSeverity,
    altitudeFrom: selectedAltitudeDebounced[0],
    altitudeTo: selectedAltitudeDebounced[2],
  })

  const handleLoadMap = useCallback(({ target }) => setMap(target), []);

  const nowcastingFeatureCollection = useMemo(() => {
    const hexagons = Nowcasting.prepareNowcastingDataForMapHexagons({ data: filteredNowcastingData });
    return GeoUtils.getHexagonsFeatureCollection(hexagons);
  }, [filteredNowcastingData]);

  const observationFeatureCollection = useMemo(() => {
    return GeoUtils.getHexagonsFeatureCollection(observationFlowData);
  }, [observationFlowData]);

  const handleAltitudeChange = useCallback(
    (value) => {
      setSelectedAltitude(value);
      debouncedAltitudeChange(value);
    }, []
  );

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <DeckGL
        initialViewState={INITIAL_MAP_VIEW_STATE}
        onViewStateChange={handleMapMove}
        controller
        layers={[
          new GeoJsonLayer({
            ...MAP_GEOJSON_LAYER_CONFIG,
            data: nowcastingFeatureCollection,
          }),
          new GeoJsonLayer({
            ...MAP_OBSERVATION_CONFIG,
            data: observationFeatureCollection,
          }),
        ]}
      >
        <Map
          onLoad={handleLoadMap}
          mapStyle={INITIAL_MAP_STYLE}
          mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
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
    </div>
  );
};

export default App;
