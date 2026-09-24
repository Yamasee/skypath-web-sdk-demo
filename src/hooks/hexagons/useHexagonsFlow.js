import { useCallback, useEffect, useState } from "react";

export const useHexagonsFlow = (flow, { autoStart = true } = {}) => {
  const [data, setData] = useState(null);
  const [isRunning, setIsRunning] = useState(() => flow?.isRunning || false);
  const [isProcessing, setIsProcessing] = useState(false);

  const stop = useCallback(() => {
    if (!flow?.isRunning) return;

    setData(null);
    flow.stop();
    setIsRunning(false);
  }, [flow]);

  const toggle = useCallback(() => {
    if (!flow) return;

    if (flow.isRunning) {
      stop();
      return;
    }
    flow.start();
    setIsRunning(flow.isRunning);
  }, [flow, stop]);

  useEffect(() => {
    if (!flow) return;

    const dataHandler = (newData) => setData(newData);
    flow.onData(dataHandler);
    
    if (flow.onIsProcessingChange) {
      flow.onIsProcessingChange(setIsProcessing);
    }
    
    if (flow.onError) {
      flow.onError((error) => console.error("Flow error:", error));
    }
    
    if (autoStart) {
      flow.start();
    }
    setIsRunning(flow.isRunning);

    return () => {
      flow.terminate();
    };
  }, [flow, autoStart]);

  return {
    data,
    updateConfig: flow?.updateConfig,
    toggle,
    stop,
    isRunning,
    isProcessing,
  };
};
