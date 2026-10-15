import { useCallback, useMemo, useState } from "react";
import useAnimationFrame from "./useAnimationFrame";
import { ALTITUDE_SLIDER_INITIAL_VALUE, FORECAST_SLIDER_CONFIG } from "../../config";
import { PREVIEW_LAYERS } from "../../lib/preview-data";
import {
  advancePreviewDistance,
  createPreviewWorld,
  getPreviewClusters,
  getPreviewCullDistance,
  getPreviewFrame,
  getPreviewHour,
  replanPreviewRoute,
} from "../../lib/preview-utils";

const PREVIEW_SEED = 7;
const INITIAL_FILTERS = { activeLayer: PREVIEW_LAYERS[0], altitude: ALTITUDE_SLIDER_INITIAL_VALUE };

const useLoginPreview = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [flight, setFlight] = useState(() => ({
    filters: INITIAL_FILTERS,
    world: createPreviewWorld(PREVIEW_SEED, INITIAL_FILTERS),
    distance: 0,
  }));

  const applyFilters = useCallback((change) => {
    setFlight((current) => {
      const filters = { ...current.filters, ...change };
      return { ...current, filters, world: replanPreviewRoute(current.world, current.distance, filters) };
    });
  }, []);
  const handleLayerChange = useCallback((activeLayer) => applyFilters({ activeLayer }), [applyFilters]);
  const handleAltitudeChange = useCallback((altitude) => applyFilters({ altitude }), [applyFilters]);

  const handleFrame = useCallback(
    (seconds) => setFlight((current) => ({ ...current, distance: advancePreviewDistance(current.distance, seconds) })),
    []
  );
  useAnimationFrame(handleFrame, isPlaying);

  const togglePlayback = useCallback(() => setIsPlaying((state) => !state), []);

  const { filters, world, distance } = flight;
  const cullDistance = getPreviewCullDistance(distance);
  const hour = getPreviewHour(distance, FORECAST_SLIDER_CONFIG);
  const forecastValue = useMemo(() => [hour], [hour]);
  const frame = useMemo(() => getPreviewFrame(world, distance), [world, distance]);
  const clusters = useMemo(() => getPreviewClusters(world, cullDistance, filters), [world, cullDistance, filters]);

  return {
    layers: PREVIEW_LAYERS,
    activeLayer: filters.activeLayer,
    onLayerChange: handleLayerChange,
    altitude: filters.altitude,
    onAltitudeChange: handleAltitudeChange,
    forecastValue,
    isPlaying,
    togglePlayback,
    frame,
    clusters,
  };
};

export default useLoginPreview;
