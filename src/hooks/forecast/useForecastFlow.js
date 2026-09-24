import {GeoJsonLayer} from "deck.gl";
import {useEffect, useMemo, useCallback} from "react";
import {MAP_GEOJSON_LAYER_CONFIG} from "../../config";
import {useHexagonsFlow} from "../hexagons/useHexagonsFlow";

const useForecastFlow = ({ sdk , polygon, options }) => {
  const {selectedMinSeverity, selectedAltitudeDebounced, selectedForecast } = options;

  // Create flow
  const createFlow = useCallback(() => sdk.IS_FORECAST_ENABLED ? sdk.createForecastFlow() : null, [sdk]);

  // Use flow
  const {
    flow,
    data,
    updateConfig,
    toggle,
    isRunning,
    isProcessing,
  } = useHexagonsFlow(createFlow);

  // get the data in a featureCollection format
  const featureCollection = useMemo(() => data?.toFeatureCollection(), [data]);

  // Update flow config
  useEffect(() => {
    if (!polygon?.length || !flow) {
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
  }, [flow, polygon, selectedForecast, updateConfig, selectedMinSeverity, selectedAltitudeDebounced]);

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

export default useForecastFlow;