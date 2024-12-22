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
  MAP_GEOJSON_LAYER_CONFIG,
  MAP_OBSERVATION_CONFIG,
} from "./config";
// SkyPath SDK
import {
  CoreUtils,
  GeoUtils,
  Nowcasting,
  Observations,
} from "@yamasee/skypath-sdk-web";
// Features
import { useNowcastingFlow } from "./hooks/nowcasting/useNowcastingFlow";
import { useNowcastingFiltering } from "./hooks/nowcasting/useNowcastingFiltering";
import { useObservationsFlow } from "./hooks/observations/useObservationsFlow";
import { useObservationsFiltering } from "./hooks/observations/useObservationsFiltering";
import { groupByHexIdAndSelectMostSevere } from "./lib/general-utils";
// import { useAdsbFlow } from "./hooks/adsb/useAdsbFlow";
// import { useAdsbFiltering } from "./hooks/adsb/useAdsbFiltering";

  // Equator Line GeoJSON
  const EQUATOR_GEOJSON = {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: [
        [-180, 0],
        [180, 0],
      ],
    },
    properties: {},
  };

const App = ({ sdk }) => {
  // MAP
  const [map, setMap] = useState(null);
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
  const [, nowcastingAltDebounced] = selectedAltitudeDebounced;

  // Nowcasting
  const nowcastingFlow = useMemo(() => sdk.createNowcastingFlow(), [sdk]);
  const {
    nowcastingData,
    changeViewState: changeNowcastingViewState,
    toggle: toggleNowcasting,
    isRunning: isRunningNowcasting,
  } = useNowcastingFlow(nowcastingFlow, map);
  const { filteredData: filteredNowcastingData } = useNowcastingFiltering(
    nowcastingData,
    {
      selectedSeverity: selectedMinSeverity,
      selectedAltitude: nowcastingAltDebounced,
      selectedForecast,
    }
  );
  const nowcastingFeatureCollection = useMemo(() => {
    const hexagons = Nowcasting.prepareNowcastingDataForMapHexagons({
      data: filteredNowcastingData,
    });
    return GeoUtils.getHexagonsFeatureCollection(hexagons);
  }, [filteredNowcastingData]);

  // Observations
  const observationsFlow = useMemo(() => sdk.createObservationsFlow(), [sdk]);
  const {
    data: observationsData,
    updateConfig: updateObservationsConfig,
    toggle: toggleObservations,
    isRunning: isRunningObservations,
  } = useObservationsFlow(observationsFlow);
  const { filteredData: filteredObservationsData } = useObservationsFiltering(
    observationsData,
    {
      selectedHoursAgo: Number(hours),
      selectedAltitudeFrom: selectedAltitudeDebounced[0],
      selectedAltitudeTo: selectedAltitudeDebounced[2],
      selectedSeverity: selectedMinSeverity,
    }
  );
  const observationsFeatureCollection = useMemo(() => {
    const hexagons = GeoUtils.prepareHexagonsDataForMapHexagons({
      data: filteredObservationsData,
    });

    const groupedObservationsData = groupByHexIdAndSelectMostSevere({
      hexagons,
    });

    return GeoUtils.getHexagonsFeatureCollection(
      Object.values(groupedObservationsData)
    );
  }, [filteredObservationsData]);

  // ADSB
  // const adsbFlow = useMemo(() => sdk.createAdsbFlow(), [sdk]);
  // const {
  //   data: adsbData,
  //   changeViewState: changeAdsbViewState,
  //   toggle: toggleAdsb,
  //   isRunning: isRunningAdsb,
  // } = useAdsbFlow(adsbFlow, map);
  // const { filteredData: filteredAdsbData } = useAdsbFiltering(
  //   adsbData,
  //   {
  //     selectedHoursAgo: Number(hours),
  //     selectedAltitudeFrom: selectedAltitudeDebounced[0],
  //     selectedAltitudeTo: selectedAltitudeDebounced[2],
  //     selectedSeverity: selectedMinSeverity,
  //   }
  // );
  // const adsbFeatureCollection = useMemo(() => {
  //   const hexagons = GeoUtils.prepareHexagonsDataForMapHexagons({
  //     data: filteredAdsbData,
  //   });

  //   const groupedAdsbData = groupByHexIdAndSelectMostSevere({
  //     hexagons,
  //   });

  //   return GeoUtils.getHexagonsFeatureCollection(
  //     Object.values(groupedAdsbData)
  //   );
  //   // return GeoUtils.getHexagonsFeatureCollection(hexagons);
  // }, [filteredAdsbData]);

  // Handlers
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSetSelectedAltitude = useCallback(
    CoreUtils.debounce((value) => setSelectedAltitudeDebounced(value), 500),
    [setSelectedAltitudeDebounced]
  );

  const handleLoadMap = useCallback(({ target }) => setMap(target), []);
  const handleAltitudeChange = (value) => {
    setSelectedAltitude(value);
    debouncedSetSelectedAltitude(value);
  };
  const handleSetAircraftCategory = (value) => {
    const polygon = GeoUtils.getMapPolygon(map);
    setAircraftCategory(value);
    updateObservationsConfig({
      polygon,
      aircraftCategory: value,
    });
  };

  const handleMapMove = CoreUtils.debounce(() => {
    if (!mapIsReady) return;
    const polygon = GeoUtils.getMapPolygon(map);

    changeNowcastingViewState();
    updateObservationsConfig({
      polygon,
      aircraftCategory,
    });

    // changeAdsbViewState();
  }, 500);

  useEffect(() => {
    if (!mapIsReady) return;
    const polygon = GeoUtils.getMapPolygon(map);

    updateObservationsConfig({
      polygon,
      aircraftCategory,
    });
  }, [mapIsReady, map, updateObservationsConfig, aircraftCategory]);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <DeckGL
        initialViewState={INITIAL_MAP_VIEW_STATE}
        onViewStateChange={handleMapMove}
        controller
        layers={[
          new GeoJsonLayer({
            id: "equator-layer",
            data: EQUATOR_GEOJSON,
            stroked: true,
            filled: false,
            getLineColor: [255, 255, 255, 50],
            lineWidthMinPixels: 1,
            getLineWidth: 2,
          }),
          new GeoJsonLayer({
            ...MAP_GEOJSON_LAYER_CONFIG,
            visible: isRunningNowcasting,
            data: nowcastingFeatureCollection,
          }),
          new GeoJsonLayer({
            ...MAP_OBSERVATION_CONFIG,
            visible: isRunningObservations,
            data: observationsFeatureCollection,
          }),
          // new GeoJsonLayer({
          //   ...MAP_OBSERVATION_CONFIG,
          //   visible: isRunningAdsb,
          //   data: adsbFeatureCollection,
          // }),
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
      {/* Observations */}
      <div className="absolute z-10 flex flex-col gap-1 p-2 top-[3em] right-2 w-[9em]">
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
      {/* ADSB */}
      {/* <div className="absolute z-10 flex flex-col gap-1 p-2 top-[5.5em] right-2 w-[9em]">
        <button
          className={cn(
            "px-2 py-1 rounded-md",
            isRunningAdsb
              ? "bg-gradient-to-b from-white to-gray-100 text-gray-950"
              : "bg-gray-200 text-gray-400"
          )}
          onClick={toggleAdsb}
        >
          ADSB
        </button>
      </div> */}
    </div>
  );
};

export default App;
