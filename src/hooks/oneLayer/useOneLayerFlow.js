import dayjs from "dayjs";
import { GeoJsonLayer } from "deck.gl";
import { useMemo, useEffect } from "react";
import { MAP_ONELAYER_CONFIG } from "../../config";
import { useHexagonsFlow } from "../hexagons/useHexagonsFlow";

const useOneLayerFlow = ({ sdk, polygon, options }) => {
  const { selectedMinSeverity, hours, selectedAltitudeDebounced, forecastAlt, aircraftCategory, selectedForecast, isOnelayerForecastEnabled } = options;

  // Create flow
  const flow = useMemo(() => sdk.IS_ONELAYER_ENABLED ? sdk.createOneLayerFlow() : null, [sdk]);

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
    if (!polygon?.length || !flow) {
      return;
    }

    updateConfig({
      // Config
      polygon,
      hoursAgo: hours,

      // Local Filters
      isForecastEnabled: isOnelayerForecastEnabled,
      forecastAlt,
      forecastTs: dayjs().add(selectedForecast, 'hour').unix(),
      aircraftCategory,
      minAltitude: selectedAltitudeDebounced[0],
      maxAltitude: selectedAltitudeDebounced[2],
      minSeverity: selectedMinSeverity,
    });
  }, [flow, aircraftCategory, hours, polygon, forecastAlt, isOnelayerForecastEnabled,
    selectedForecast, updateConfig, selectedMinSeverity, selectedAltitudeDebounced]);

  // get the data in a featureCollection format
  const featureCollection = useMemo(() => data?.toFeatureCollection(), [data]);

  // Create layer
  const layer = useMemo(() => new GeoJsonLayer({
      ...MAP_ONELAYER_CONFIG,
      visible: isRunning && !!featureCollection,
      data: featureCollection,
    }),[isRunning, featureCollection]);


  return { layer, toggle, isProcessing, isRunning };
};

export default useOneLayerFlow;
