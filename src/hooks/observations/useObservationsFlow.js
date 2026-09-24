import { GeoJsonLayer } from "deck.gl";
import { useMemo, useEffect, useCallback } from "react";
import { MAP_OBSERVATION_CONFIG } from "../../config";
import { useHexagonsFlow } from "../hexagons/useHexagonsFlow";

const useObservationsFlow = ({ sdk, polygon, options }) => {
  const { selectedMinSeverity, hours, selectedAltitudeDebounced, aircraftCategory } = options;

  // Create flow
  const createFlow = useCallback(() => sdk.createObservationsFlow(), [sdk]);

  // Use flow
  // OneLayer already includes observations, so Observations starts only when OneLayer is not available
  const {
    flow,
    data,
    updateConfig,
    toggle,
    stop,
    isRunning,
    isProcessing,
  } = useHexagonsFlow(createFlow, { autoStart: !sdk.IS_ONELAYER_ENABLED });

  // Update config
  useEffect(() => {
    if (!polygon?.length || !flow) {
      return;
    }

    updateConfig({
      // Config
      polygon,
      aircraftCategory,
      // Client filters
      historyHours: Number(hours),
      minAltitude: selectedAltitudeDebounced[0],
      maxAltitude: selectedAltitudeDebounced[2],
      minSeverity: selectedMinSeverity,
    });
  }, [flow, aircraftCategory, hours, polygon, updateConfig, selectedMinSeverity, selectedAltitudeDebounced]);

  // get the data in a featureCollection format
  const featureCollection = useMemo(() => data?.toFeatureCollection(), [data]);

  // Create layer
  const layer = useMemo(() => new GeoJsonLayer({
      ...MAP_OBSERVATION_CONFIG,
      visible: isRunning && !!featureCollection,
      data: featureCollection,
    }),[isRunning, featureCollection]);


  return { layer, toggle, stop, isProcessing, isRunning };
};

export default useObservationsFlow;
