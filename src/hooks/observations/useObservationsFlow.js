import { useCallback, useEffect, useState } from "react";

/**
 * Custom hook to handle the Observations flow
 * @param {Object} observationsFlow Observations flow instance
 * @returns {Object} observationsData, updateConfig, toggle, isRunning
 */
export const useObservationsFlow = (observationsFlow) => {
  const [observationsData, setObservationsData] = useState();
  const [isRunning, setIsRunning] = useState(() => observationsFlow.isRunning);

  useEffect(() => {
    if (!observationsFlow) return;

    observationsFlow.onData((data) => setObservationsData(data));
    observationsFlow.start();

    setIsRunning(observationsFlow.isRunning);

    // Cleanup
    return () => observationsFlow.terminate();
  }, [observationsFlow]);

  const toggle = useCallback(() => {
    if (observationsFlow.isRunning) {
      setObservationsData(null);
      observationsFlow.stop();
    } else {
      observationsFlow.start();
    }
    setIsRunning(observationsFlow.isRunning);
  }, [observationsFlow]);

  return {
    data: observationsData,
    updateConfig: observationsFlow.updateConfig,
    toggle,
    isRunning,
  };
};
