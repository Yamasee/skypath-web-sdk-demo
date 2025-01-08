import { useCallback, useEffect, useState } from "react";

/**
 * Custom hook to handle the hexagons flows
 * @param {Object} hexagonsFlow Hexagons flow instance
 * @returns {Object} hexagonsData, updateConfig, toggle, isRunning
 */
export const useHexagonsFlow = (flow) => {
  const [data, setData] = useState();
  const [isRunning, setIsRunning] = useState(() => flow.isRunning);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!flow) return;

    flow.onData((newData) => setData(newData));
    flow.onIsProcessingChange?.((_isProcessing) => setIsProcessing(_isProcessing));
    flow.onError?.((error) => console.error(error));
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

  return {
    data,
    updateConfig: flow.updateConfig,
    toggle,
    isRunning,
    isProcessing,
  };
};
