import {useMemo} from "react";
import {GeoUtils} from "@skypath-io/web-sdk";

/**
 * Hook to filter hexagons data based on selected filters
 * @param {Array} data - Hexagons data
 * @param {Object} filters - Filters object
 * @returns {Object} - Filtered data
 */
export const useOneLayerFiltering = (data, filters) => {
  const {
    altitudeFrom,
    altitudeTo,
    severity,
  } = filters;

  return useMemo(() => {
    if (!data) return null;
    const _filters = {altitudeFrom, altitudeTo, severity};
    return GeoUtils.getOneLayerHexagonsDataSlice({data, filters: _filters});
  }, [data, altitudeFrom, altitudeTo, severity]);
};
