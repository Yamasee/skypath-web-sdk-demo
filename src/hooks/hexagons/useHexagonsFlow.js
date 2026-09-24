import { useCallback, useEffect, useState } from "react";

/**
 * Creates a flow on mount and terminates it on unmount.
 * A terminated flow can't be started again, so every mount gets a new one.
 */
export const useHexagonsFlow = (createFlow, { autoStart = true } = {}) => {
  const [flow, setFlow] = useState(null);
  const [data, setData] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
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
    const newFlow = createFlow();
    if (!newFlow) return;

    newFlow.onData(setData);
    newFlow.onIsProcessingChange(setIsProcessing);
    newFlow.onError((error) => console.error("Flow error:", error));

    if (autoStart) {
      newFlow.start();
    }
    setFlow(newFlow);
    setIsRunning(newFlow.isRunning);

    return () => {
      newFlow.terminate();
      setFlow(null);
      setData(null);
      setIsRunning(false);
    };
  }, [createFlow, autoStart]);

  return {
    flow,
    data,
    updateConfig: flow?.updateConfig,
    toggle,
    stop,
    isRunning,
    isProcessing,
  };
};
