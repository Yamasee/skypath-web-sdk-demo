import { useMemo } from "react";
import { GeoUtils } from "@yamasee/skypath-sdk-web";

/**
 * Hook to filter observations data based on selected filters
 * @param {Array} data - Observations data
 * @param {Object} filters - Filters object
 * @returns {Object} - Filtered data
 */
export const useObservationsFiltering = (data, filters) => {
  const {
    selectedHoursAgo,
    selectedAltitudeFrom,
    selectedAltitudeTo,
    selectedSeverity,
  } = filters;

  const filteredData = useMemo(() => {
    if (!data) return null;
    const filters = {
      hoursAgo: selectedHoursAgo,
      altitudeFrom: selectedAltitudeFrom,
      altitudeTo: selectedAltitudeTo,
      severity: selectedSeverity,
    };
    return GeoUtils.getHexagonsDataSlice({ data, filters });
  }, [data, selectedHoursAgo, selectedAltitudeFrom, selectedAltitudeTo, selectedSeverity]);

  return { filteredData };
};
