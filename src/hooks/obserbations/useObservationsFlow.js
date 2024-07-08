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
  const [isRunning, setIsRunning] = useState(
    observationFlow.getState() === "running"
  );

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

  const updateFlowIsRunningState = useCallback(() => {
      const _isRunning = observationFlow.getState() === "running";
      setIsRunning(_isRunning);
    },[observationFlow]
  )

  useEffect(() => {
    if (!observationFlow || !map) {
      return
    }

    updateMapPolygon();

    // Start observation flow
    observationFlow.onData((data) => setObservationFlowData(data));
    observationFlow.start();
    updateFlowIsRunningState();

    // Cleanup
    return () => {
      observationFlow.terminate();
      updateFlowIsRunningState();
    };
  }, [observationFlow, map]);

  const toggle = useCallback(() => {
    let _isRunning = observationFlow.getState() === "running";
    observationFlow[_isRunning ? "stop" : "start"]();
    _isRunning = observationFlow.getState() === "running";
    setIsRunning(_isRunning);
  }, [observationFlow]);

  return {
    observationFlowData,
    updateConfig,
    updateMapPolygon,
    toggle,
    isRunning,
  };
};
