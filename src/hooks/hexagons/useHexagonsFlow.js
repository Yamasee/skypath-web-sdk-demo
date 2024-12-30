import { useCallback, useEffect, useState } from "react";

/**
 * Custom hook to handle the hexagons flows
 * @param {Object} hexagonsFlow Hexagons flow instance
 * @returns {Object} hexagonsData, updateConfig, toggle, isRunning
 */
export const useHexagonsFlow = (flow) => {
  const [data, setData] = useState();
  const [isRunning, setIsRunning] = useState(() => flow.isRunning);

  useEffect(() => {
    if (!flow) return;

    flow.onData((data) => setData(data));
    flow.start();

    setIsRunning(flow.isRunning);

    return () => flow.terminate();
  }, [flow]);

  const toggle = useCallback(() => {
    if (flow.isRunning) {
      setData(null);
      flow.stop();
    } else {
      flow.start();
    }
    setIsRunning(flow.isRunning);
  }, [flow]);

  const toggleLargePolygonHandlingMode = useCallback(({ mode }) => {
    flow.updateConfig({
      largePolygonHandlingBehavior: mode,
    });
  }, [flow]);

  return {
    data,
    updateConfig: flow.updateConfig,
    toggle,
    isRunning,
    toggleLargePolygonHandlingMode,
  };
};
