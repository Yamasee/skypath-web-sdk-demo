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
  MAP_ADSB_RING_CONFIG,
  MAP_ADSB_MIDDLE_CONFIG,
  MAP_EQUATOR_CONFIG,
} from "./config";
// SkyPath SDK
import {
  CoreUtils,
  GeoUtils,
  Nowcasting,
  Observations,
} from "@skypath-io/web-sdk";
// Features
import { useNowcastingFlow } from "./hooks/nowcasting/useNowcastingFlow";
import { useNowcastingFiltering } from "./hooks/nowcasting/useNowcastingFiltering";
import { groupByHexIdAndSelectMostSevere } from "./lib/general-utils";
import { useHexagonsFlow } from "./hooks/hexagons/useHexagonsFlow";
import { useHexagonsFiltering } from "./hooks/hexagons/useHexagonsFiltering";
import useOneLayerFlow from "./hooks/oneLayer/useOneLayerFlow";

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

  // OneLayer
  const {
    layer: oneLayer,
    toggle: toggleOneLayer,
    isProcessing: isOneLayerLoading,
    isRunning: isOneLayerRunning
  } = useOneLayerFlow({sdk ,map, mapIsReady, options: {
    selectedMinSeverity,
    hours,
    selectedAltitudeDebounced,
    nowcastingAlt,
    aircraftCategory,
    selectedForecast,
  }});

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
    return GeoUtils.getHexagonsFeatureCollection({ hexagons });
  }, [filteredNowcastingData]);

  // Observations
  const observationsFlow = useMemo(() => sdk.createObservationsFlow(), [sdk]);
  const {
    data: observationsData,
    updateConfig: updateObservationsConfig,
    toggle: toggleObservations,
    isRunning: isRunningObservations,
  } = useHexagonsFlow(observationsFlow);
  const observationsFeatureCollection = useMemo(() => observationsData?.toFeatureCollection(), [observationsData]);

  // ADSB
  const adsbFlow = useMemo(() => sdk.createAdsbFlow(), [sdk]);
  const {
    data: adsbData,
    updateConfig: updateAdsbConfig,
    toggle: toggleAdsb,
    isRunning: isRunningAdsb,
    isProcessing: isProcessingAdsb,
  } = useHexagonsFlow(adsbFlow);
  const { filteredData: filteredAdsbData } = useHexagonsFiltering(
    adsbData,
    {
      selectedHoursAgo: Number(hours),
      selectedAltitudeFrom: selectedAltitudeDebounced[0],
      selectedAltitudeTo: selectedAltitudeDebounced[2],
      selectedSeverity: selectedMinSeverity,
    }
  );
  const adsbFeatureCollections = useMemo(() => {
    const hexagons = GeoUtils.prepareHexagonsDataForMapHexagons({
      data: filteredAdsbData,
    });

    const groupedAdsbData = groupByHexIdAndSelectMostSevere({
      hexagons,
    });

    const middleArea = GeoUtils.getHexagonsFeatureCollection({
        hexagons: Object.values(groupedAdsbData),
        scale: 0.5,
      });
    const ring = GeoUtils.getHexagonsFeatureCollection({
        hexagons: Object.values(groupedAdsbData),
        scale: 1,
      });
    return {
      middleArea,
      ring,
    }
    // return GeoUtils.getHexagonsFeatureCollection({ hexagons });
  }, [filteredAdsbData]);

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
    const polygon = GeoUtils.getMapPolygon({ map });

    changeNowcastingViewState();
    updateObservationsConfig({
      polygon,
      aircraftCategory,
    });
    updateAdsbConfig({
      polygon,
    });
  },
    delay: 500
  });

  useEffect(() => {
    if (!mapIsReady) return;
    const polygon = GeoUtils.getMapPolygon({ map });

    updateObservationsConfig({
      polygon,
      aircraftCategory,
      // Client filters
      historyHours: Number(hours),
      minAltitude: selectedAltitudeDebounced[0],
      maxAltitude: selectedAltitudeDebounced[2],
      minSeverity: selectedMinSeverity,
    });
  }, [
    mapIsReady,
    map,
    updateObservationsConfig,
    aircraftCategory,
    hours,
    selectedAltitudeDebounced,
    selectedMinSeverity,
  ]);

  useEffect(() => {
    if (!mapIsReady) return;
    const polygon = GeoUtils.getMapPolygon({ map });

    updateAdsbConfig({
      polygon,
    });
  }, [
    mapIsReady, map, updateAdsbConfig
  ]);

  const layers = [
    new GeoJsonLayer({
      ...MAP_EQUATOR_CONFIG,
    }),
    new GeoJsonLayer({
      ...MAP_OBSERVATION_CONFIG,
      visible: isRunningObservations,
      data: observationsFeatureCollection,
    }),
    new GeoJsonLayer({
      ...MAP_ADSB_MIDDLE_CONFIG,
      visible: isRunningAdsb,
      data: adsbFeatureCollections.middleArea,
    }),
    new GeoJsonLayer({
      ...MAP_ADSB_RING_CONFIG,
      visible: isRunningAdsb,
      data: adsbFeatureCollections.ring,
    }),
    new GeoJsonLayer({
      ...MAP_GEOJSON_LAYER_CONFIG,
      visible: isRunningNowcasting,
      data: nowcastingFeatureCollection,
    }),
    oneLayer,
  ]

  const isLoadingLayers = isProcessingAdsb || isOneLayerLoading;

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
            isRunningAdsb
              ? "bg-gradient-to-b from-white to-gray-100 text-gray-950"
              : "bg-gray-200 text-gray-400"
          )}
          onClick={toggleAdsb}
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
