import { GeoJsonLayer } from "deck.gl";
import { useMemo, useEffect } from "react";
import { MAP_OBSERVATION_CONFIG } from "../../config";
import { useHexagonsFlow } from "../hexagons/useHexagonsFlow";

const useObservationsFlow = ({ sdk, polygon, options }) => {
  const { selectedMinSeverity, hours, selectedAltitudeDebounced, aircraftCategory } = options;

  // Create flow
  const flow = useMemo(() => sdk.createObservationsFlow(), [sdk]);

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
      aircraftCategory,
      // Client filters
      historyHours: Number(hours),
      minAltitude: selectedAltitudeDebounced[0],
      maxAltitude: selectedAltitudeDebounced[2],
      minSeverity: selectedMinSeverity,
    });
  }, [aircraftCategory, hours, polygon, updateConfig, selectedMinSeverity, selectedAltitudeDebounced]);

  // get the data in a featureCollection format
  const featureCollection = useMemo(() => data?.toFeatureCollection(), [data]);

  // Create layer
  const layer = useMemo(() => new GeoJsonLayer({
      ...MAP_OBSERVATION_CONFIG,
      visible: isRunning && !!featureCollection,
      data: featureCollection,
    }),[isRunning, featureCollection]);


  return { layer, toggle, isProcessing, isRunning };
};

export default useObservationsFlow;
