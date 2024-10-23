import { useMemo } from "react";
import { ADSB } from "@yamasee/skypath-sdk-web";

/**
 * Hook to filter adsb data based on selected filters
 * @param {Array} data - ADSB data
 * @param {Object} filters - Filters object
 * @returns {Object} - Filtered data
 */
export const useAdsbFiltering = (data, filters) => {
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
    return ADSB.getAdsbDataSlice({ data, filters });
  }, [data, selectedHoursAgo, selectedAltitudeFrom, selectedAltitudeTo, selectedSeverity]);

  return { filteredData };
};
