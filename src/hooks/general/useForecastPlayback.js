import { useCallback, useEffect, useRef, useState } from "react";
import { FORECAST_PLAYBACK_INTERVAL } from "../../lib/constants";

const useForecastPlayback = ({ setSelectedForecast, min, max }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const setSelectedForecastRef = useRef(setSelectedForecast);

  useEffect(() => {
    setSelectedForecastRef.current = setSelectedForecast;
  }, [setSelectedForecast]);

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setSelectedForecastRef.current((hour) => (hour >= max ? min : hour + 1));
    }, FORECAST_PLAYBACK_INTERVAL);

    return () => clearInterval(timer);
  }, [isPlaying, min, max]);

  const togglePlayback = useCallback(() => setIsPlaying((state) => !state), []);

  return { isPlaying, togglePlayback };
};

export default useForecastPlayback;
