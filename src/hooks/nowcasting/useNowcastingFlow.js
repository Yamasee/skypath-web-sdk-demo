import {GeoJsonLayer} from "deck.gl";
import {useEffect, useMemo} from "react";
import {MAP_GEOJSON_LAYER_CONFIG} from "../../config";
import {useHexagonsFlow} from "../hexagons/useHexagonsFlow";

const useNowcastingFlow = ({ sdk , polygon, options }) => {
  const {selectedMinSeverity, selectedAltitudeDebounced, selectedForecast } = options;

  // Create flow
  const flow = useMemo(() => sdk.createNowcastingFlow(), [sdk]);

  // Use flow
  const {
    data,
    updateConfig,
    toggle,
    isRunning,
    isProcessing,
  } = useHexagonsFlow(flow);

  // get the data in a featureCollection format
  const featureCollection = useMemo(() => data?.toFeatureCollection(), [data]);

  // Update flow config
  useEffect(() => {
    if (!polygon?.length) {
      return;
    }

    updateConfig({
      // Config
      polygon,
      // Local Filters
      forecast: selectedForecast,
      minAltitude: selectedAltitudeDebounced[1],
      maxAltitude: selectedAltitudeDebounced[1],
      minSeverity: selectedMinSeverity,
    });
  }, [polygon, selectedForecast, updateConfig, selectedMinSeverity, selectedAltitudeDebounced]);

  // Create layer
  const layer = useMemo(() => new GeoJsonLayer(
    {
    ...MAP_GEOJSON_LAYER_CONFIG,
    visible: isRunning && !!featureCollection,
    data: featureCollection,
  }
  ), [featureCollection, isRunning])

  return {
    layer,
    toggle,
    isRunning,
    isProcessing,
  };
}

export default useNowcastingFlow;