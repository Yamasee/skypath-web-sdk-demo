// React
import {
  useMemo,
  useState,
  useCallback,
} from "react";
// Map
import { Map } from "react-map-gl";
import DeckGL from "@deck.gl/react";
import { GeoJsonLayer } from "deck.gl";
// Components
import {MapControls} from "./components/organisms/MapControls";
// Config
import {
  INITIAL_MAP_VIEW_STATE,
  INITIAL_MAP_STYLE,
  MAP_GEOJSON_LAYER_CONFIG,
  ALTITUDE_SLIDER_INITIAL_VALUE,
  MAPBOX_ACCESS_TOKEN,
  SKYPATH_API_KEY,
  SKYPATH_API_BASE_URL,
} from "./config";
// SkyPath SDK
import SkyPathSDK, {
  CoreUtils,
  GeoUtils,
  Nowcasting,
} from "@yamasee/skypath-sdk-web";
// Features
import { useNowcastingFlow } from "./hooks/nowcasting/useNowcastingFlow";
import { useNowcastingFiltering } from "./hooks/nowcasting/useNowcastingFiltering";

const sdk = new SkyPathSDK({
  apiKey: SKYPATH_API_KEY,
  baseUrl: SKYPATH_API_BASE_URL,
});
const nowcastingFlow = sdk.createNowcastingFlow();

const App = () => {

  const [map, setMap] = useState(null);
  const [selectedForecast, setSelectedForecast] = useState(0)
  const [selectedMinSeverity, setSelectedMinSeverity] = useState(2)
  const [selectedAltitudeDebounced, setSelectedAltitudeDebounced] = useState(ALTITUDE_SLIDER_INITIAL_VALUE);
  const [selectedAltitude, setSelectedAltitude] = useState(ALTITUDE_SLIDER_INITIAL_VALUE);

  const debouncedAltitudeChange = CoreUtils.debounce(
    (value) => setSelectedAltitudeDebounced(value), 500
  );

  const [ bottomAlt, nowcastingAlt, topAlt ] = selectedAltitude;
  const [, nowcastingAltDebounced ] = selectedAltitudeDebounced;

  const { nowcastingData, changeViewState } = useNowcastingFlow(nowcastingFlow, map);

  const { filteredData } = useNowcastingFiltering(nowcastingData, {
    selectedSeverity: selectedMinSeverity,
    selectedAltitude: nowcastingAltDebounced,
    selectedForecast,
  })

  const handleLoadMap = useCallback(({ target }) => setMap(target), []);

  const featureCollection = useMemo(() => {
    const hexagons = Nowcasting.prepareNowcastingDataForMapHexagons({ data: filteredData });
    const features = GeoUtils.getHexagonsFeatureCollection(hexagons);
    return features;
  }, [filteredData]);

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
        onViewStateChange={changeViewState}
        controller
        layers={[
          new GeoJsonLayer({
            ...MAP_GEOJSON_LAYER_CONFIG,
            data: featureCollection,
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
      />
    </div>
  );
};

export default App;
