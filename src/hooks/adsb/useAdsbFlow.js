import { useCallback, useEffect, useState } from "react";
import { CoreUtils, GeoUtils } from "@yamasee/skypath-sdk-web";
import { DEFAULT_DEBOUNCE_TIME } from "../../config";
import { checkMapIsReady } from "../../lib/general-utils";

// Debounce time for updating hexIds
const updateHexIds = CoreUtils.debounce((map, onResult) => {
  const hexIds = GeoUtils.getHexIdsFromMapboxMap(map);
  onResult(hexIds);
}, DEFAULT_DEBOUNCE_TIME);

/**
 * Custom hook to handle the ADSB flow
 *
 * @param {Object} adsbFlow ADSB flow instance
 * @param {Object} map Map instance
 * @returns {Object} adsbData, changeViewState
 */
export const useAdsbFlow = (adsbFlow, map) => {
  // Raw data from adsb flow
  const [adsbData, setAdsbData] = useState();
  const [isRunning, setIsRunning] = useState(adsbFlow.getState() === "running");

  const changeViewState = useCallback(() => {
    // Check if map is ready
    const mapIsReady = checkMapIsReady(map);
    if (!mapIsReady || !adsbFlow) return;

    // Update hexIds
    updateHexIds(map, (hexIds) => {
      adsbFlow.updateConfig({ hexIds });
    });
  }, [map, adsbFlow]);

  useEffect(() => {
    // Check if map is ready
    const mapIsReady = checkMapIsReady(map);
    if (!mapIsReady || !adsbFlow) return;

    // Get hexIds from map
    const hexIds = GeoUtils.getHexIdsFromMapboxMap(map);

    // Start nowcasting flow
    adsbFlow.onData((data) => setAdsbData(data));
    adsbFlow.start();
    const _isRunning = adsbFlow.getState() === "running";
    setIsRunning(_isRunning);

    // update config file with the hexIds for initial load
    adsbFlow.updateConfig({ hexIds });
    // Cleanup
    return () => adsbFlow.terminate();
  }, [map, adsbFlow]);

  const toggle = useCallback(() => {
    let _isRunning = adsbFlow.getState() === "running";
    adsbFlow[_isRunning ? "stop" : "start"]();
    _isRunning = adsbFlow.getState() === "running";
    setIsRunning(_isRunning);
  }, [adsbFlow]);

  return {
    adsbData,
    changeViewState,
    toggle,
    isRunning,
  };
};
