import { useCallback, useRef } from "react";
import { shiftRange } from "../../lib/slider-utils";

/**
 * Drags the whole selected range of a vertical Radix slider.
 * Radix only moves one thumb at a time, so the range element handles its own pointer events.
 */
const useRangeDrag = ({ trackRef, value, onValueChange, min, max, disabled }) => {
  const dragRef = useRef(null);

  const toLevel = useCallback(
    (clientY) => {
      const rect = trackRef.current.getBoundingClientRect();
      return (1 - (clientY - rect.top) / rect.height) * (max - min) + min;
    },
    [trackRef, min, max]
  );

  const onPointerDown = useCallback(
    (event) => {
      if (disabled || !trackRef.current) return;
      event.stopPropagation();
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      dragRef.current = { startLevel: toLevel(event.clientY), startValue: value };
    },
    [disabled, trackRef, toLevel, value]
  );

  const onPointerMove = useCallback(
    (event) => {
      if (!dragRef.current) return;
      event.stopPropagation();
      const { startLevel, startValue } = dragRef.current;
      const delta = Math.round(toLevel(event.clientY) - startLevel);
      onValueChange(shiftRange(startValue, delta, min, max));
    },
    [toLevel, onValueChange, min, max]
  );

  const onPointerUp = useCallback((event) => {
    if (!dragRef.current) return;
    event.stopPropagation();
    event.currentTarget.releasePointerCapture(event.pointerId);
    dragRef.current = null;
  }, []);

  return { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp };
};

export default useRangeDrag;
