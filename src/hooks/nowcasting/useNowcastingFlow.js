import { useCallback, useEffect, useState } from "react";
import { CoreUtils, GeoUtils } from "@yamasee/skypath-sdk-web";
import { DEFAULT_DEBOUNCE_TIME } from "../../config";
import {checkMapIsReady} from "../../lib/general-utils";

// Debounce time for updating hexIds
const updateHexIds = CoreUtils.debounce((map, onResult) => {
  const hexIds = GeoUtils.getHexIdsFromMapboxMap(map);
  onResult(hexIds);
}, DEFAULT_DEBOUNCE_TIME);

/**
 * Custom hook to handle the nowcasting flow
 * 
 * @param {Object} nowcastingFlow Nowcasting flow instance
 * @param {Object} map Map instance
 * @returns {Object} nowcastingData, changeViewState
 */
export const useNowcastingFlow = (nowcastingFlow, map) => {

  // Raw data from nowcasting flow
  const [nowcastingData, setNowcastingData] = useState({});
  const [isRunning, setIsRunning] = useState(
    nowcastingFlow.getState() === "running"
  );

  const changeViewState = useCallback(() => {
    // Check if map is ready
    const mapIsReady = checkMapIsReady(map);
    if (!mapIsReady || !nowcastingFlow) return;

    // Update hexIds
    updateHexIds(map, (hexIds) => {
      nowcastingFlow.updateConfig({ hexIds });
    });
  }, [map, nowcastingFlow]);


  useEffect(() => {
    // Check if map is ready
    const mapIsReady = checkMapIsReady(map);
    if (!mapIsReady || !nowcastingFlow) return;

    // Get hexIds from map
    const hexIds = GeoUtils.getHexIdsFromMapboxMap(map);

    // Start nowcasting flow
    nowcastingFlow.onData((data) => setNowcastingData(data));
    nowcastingFlow.start();
    const _isRunning = nowcastingFlow.getState() === "running";
    setIsRunning(_isRunning);

    // update config file with the hexIds for initial load
    nowcastingFlow.updateConfig({ hexIds });
    // Cleanup
    return () => nowcastingFlow.terminate();
  }, [map, nowcastingFlow]);

  const toggle = useCallback(() => {
    let _isRunning = nowcastingFlow.getState() === "running";
    nowcastingFlow[_isRunning ? "stop" : "start"]();
    _isRunning = nowcastingFlow.getState() === "running";
    setIsRunning(_isRunning);
  }, [nowcastingFlow]);

  return {
    nowcastingData,
    changeViewState,
    toggle,
    isRunning,
  };
};
