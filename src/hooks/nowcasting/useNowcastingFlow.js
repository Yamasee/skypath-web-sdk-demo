import { useCallback, useEffect, useState } from "react";
import {
  CoreUtils,
  GeoUtils,
  Nowcasting,
} from "skypath-sdk";
import { DEFAULT_DEBOUNCE_TIME } from "../../config";

// Debounce time for updating hexIds
const updateHexIds = CoreUtils.debounce((map, onResult) => {
  const hexIds = GeoUtils.getHexIdsFromMapBoxMap(map);
  onResult(hexIds);
}, DEFAULT_DEBOUNCE_TIME);

// Check if map is ready
const checkMapIsReady = (map) => map?.loaded();

/**
 * Custom hook to handle the nowcasting flow
 * 
 * @param {Nowcasting} nowcastingFlow Nowcasting flow instance
 * @param {Map} map Map instance
 * @returns {Object} nowcastingData, changeViewState
 */
export const useNowcastingFlow = (nowcastingFlow, map) => {

  // Raw data from nowcasting flow
  const [nowcastingData, setNowcastingData] = useState({});


  const changeViewState = useCallback(() => {
    // Check if map is ready
    const mapIsReady = checkMapIsReady(map);
    if (!mapIsReady || !nowcastingFlow) return;

    // Update hexIds
    updateHexIds(map, (hexIds) => {
      nowcastingFlow.emit(Nowcasting.EMIT_EVENTS.UPDATE, { hexIds });
    });
  }, [map, nowcastingFlow]);


  useEffect(() => {
    // Check if map is ready
    const mapIsReady = checkMapIsReady(map);
    if (!mapIsReady || !nowcastingFlow) return;

    // Get hexIds from map
    const hexIds = GeoUtils.getHexIdsFromMapBoxMap(map);

    // Start nowcasting flow
    nowcastingFlow.start({ hexIds });
    nowcastingFlow.on(Nowcasting.LISTEN_EVENTS.DATA, (data) => setNowcastingData(data));

    // Cleanup
    return () => nowcastingFlow.terminate();
  }, [map, nowcastingFlow]);


  return {
    nowcastingData,
    changeViewState,
  };
};
