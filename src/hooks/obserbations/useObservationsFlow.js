import { useCallback, useEffect, useState } from "react";
import { GeoUtils } from "@yamasee/skypath-sdk-web";
import {checkMapIsReady} from "../../lib/general-utils";

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
  const [isActive, setIsActive] = useState(false);

  const toggleFlow = () => {
    if (isActive) {
      observationFlow.stop();
      setIsActive(false);
    } else {
      observationFlow.start();
      setIsActive(true);
    }
  }

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
    observationFlow.onData((data) => setObservationFlowData(data));
    observationFlow.start();
    setIsActive(true);

    // Cleanup
    return () => observationFlow.stop();
  }, [observationFlow, map]);

  return {
    observationFlowData,
    updateConfig,
    updateMapPolygon,
    useFlowToggle: [isActive, toggleFlow],
  };
};
