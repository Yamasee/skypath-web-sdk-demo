import dayjs from "dayjs";
import { GeoJsonLayer } from "deck.gl";
import { useMemo, useEffect } from "react";
import { GeoUtils } from "@skypath-io/web-sdk";
import { MAP_ONELAYER_CONFIG } from "../../config";
import { useHexagonsFlow } from "../hexagons/useHexagonsFlow";

const App = ({ sdk, map, mapIsReady, options }) => {
  const { selectedMinSeverity, hours, selectedAltitudeDebounced, nowcastingAlt, aircraftCategory, selectedForecast } = options;

  // Create flow
  const flow = useMemo(() => sdk.createOneLayerFlow(), [sdk]);

  // Use flow
  const {
    data,
    updateConfig,
    toggle,
    isRunning,
    isProcessing,
  } = useHexagonsFlow(flow);

  // Update config
  useEffect(() => {
    if (!mapIsReady) return;

    const polygon = GeoUtils.getMapPolygon({ map });

    updateConfig({
      // Config
      polygon,
      hoursAgo: hours,

      // Local Filters
      nowcastingAlt,
      forecastTs: dayjs().add(selectedForecast, 'hour').unix(),
      aircraftCategory,
      minAltitude: selectedAltitudeDebounced[0],
      maxAltitude: selectedAltitudeDebounced[2],
      minSeverity: selectedMinSeverity,
    });
  }, [aircraftCategory, hours, map, mapIsReady, nowcastingAlt,
    selectedForecast, updateConfig, selectedMinSeverity, selectedAltitudeDebounced]);

  // Create layer
  const layer = useMemo(() => new GeoJsonLayer({
      ...MAP_ONELAYER_CONFIG,
      visible: isRunning,
      data: data?.toFeatureCollection(),
    }),[isRunning, data]);


  return { layer, toggle, isProcessing, isRunning };
};

export default App;
