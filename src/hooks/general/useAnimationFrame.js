import { useEffect, useRef } from "react";

const useAnimationFrame = (onFrame, isRunning) => {
  const onFrameRef = useRef(onFrame);

  useEffect(() => {
    onFrameRef.current = onFrame;
  }, [onFrame]);

  useEffect(() => {
    if (!isRunning) return;

    let frame;
    let previous = performance.now();
    const tick = (now) => {
      onFrameRef.current((now - previous) / 1000);
      previous = now;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [isRunning]);
};

export default useAnimationFrame;
