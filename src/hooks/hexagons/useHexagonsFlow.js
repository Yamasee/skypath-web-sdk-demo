import { useCallback, useEffect, useState } from "react";

export const useHexagonsFlow = (flow) => {
  const [data, setData] = useState(null);
  const [isRunning, setIsRunning] = useState(() => flow?.isRunning || false);
  const [isProcessing, setIsProcessing] = useState(false);

  const toggle = useCallback(() => {
    if (!flow) return;
    
    if (flow.isRunning) {
      setData(null);
      flow.stop();
    } else {
      flow.start();
    }
    setIsRunning(flow.isRunning);
  }, [flow]);

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
    
    flow.start();
    setIsRunning(flow.isRunning);

    return () => {
      flow.terminate();
    };
  }, [flow]);

  return {
    data,
    updateConfig: flow?.updateConfig,
    toggle,
    isRunning,
    isProcessing,
  };
};
