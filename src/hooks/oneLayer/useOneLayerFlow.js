import dayjs from "dayjs";
import { GeoJsonLayer } from "deck.gl";
import { useMemo, useEffect } from "react";
import { MAP_ONELAYER_CONFIG } from "../../config";
import { useHexagonsFlow } from "../hexagons/useHexagonsFlow";

const useOneLayerFlow = ({ sdk, polygon, options }) => {
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
    if (!polygon?.length) {
      return;
    }
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
  }, [aircraftCategory, hours, polygon, nowcastingAlt,
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
