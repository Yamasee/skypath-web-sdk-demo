import { useMemo } from "react";
import { GeoUtils } from "@skypath-io/web-sdk";

/**
 * Hook to filter hexagons data based on selected filters
 * @param {Array} data - Hexagons data
 * @param {Object} filters - Filters object
 * @returns {Object} - Filtered data
 */
export const useHexagonsFiltering = (data, filters) => {
  const {
    selectedHoursAgo,
    selectedAltitudeFrom,
    selectedAltitudeTo,
    selectedSeverity,
  } = filters;

  const filteredData = useMemo(() => {
    if (!data) return null;
    const filters = {
      historyHours: selectedHoursAgo,
      minAltitude: selectedAltitudeFrom,
      maxAltitude: selectedAltitudeTo,
      minSeverity: selectedSeverity,
    };
    return GeoUtils.getHexagonsDataSlice({ data, filters });
  }, [data, selectedHoursAgo, selectedAltitudeFrom, selectedAltitudeTo, selectedSeverity]);

  return { filteredData };
};
