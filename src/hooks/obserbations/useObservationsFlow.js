import { useCallback, useEffect, useState } from "react";
import { GeoUtils } from "@yamasee/skypath-sdk-web";

// Check if map is ready
const checkMapIsReady = (map) => map?.loaded();

/**
 * Custom hook to handle the observation flow
 *
 * @param {object} observationFlow observation flow instance
 * @param {Map} map Map instance
 * @returns {Object} observationFlowData, updateConfig
 */
export const useObservationsFlow = (observationFlow, map) => {

  // Raw data from observation flow`
  const [observationFlowData, setObservationFlowData] = useState({});

  const updateConfig = useCallback((config) => {
    observationFlow.updateConfig(config);
  }, [observationFlow]);


  const updateMapPolygon = useCallback(() => {
    // Check if map is ready
      const mapIsReady = checkMapIsReady(map);
      if (!observationFlow || !mapIsReady) {
        return
      }

    observationFlow.updateConfig({ polygon: GeoUtils.getMapPolygon(map) })
  }, [observationFlow, map]);

  useEffect(() => {
    if (!observationFlow) {
      return
    }

    updateMapPolygon();

    // Start observation flow
    observationFlow.on((data) => setObservationFlowData(data));
    observationFlow.start();

    // Cleanup
    return () => observationFlow.stop();
  }, [observationFlow, map]);


  return {
    observationFlowData,
    updateConfig,
    updateMapPolygon,
  };
};
