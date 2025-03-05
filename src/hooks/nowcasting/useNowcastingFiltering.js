import { useMemo } from "react";
import { Nowcasting } from "@skypath-io/web-sdk";

/**
 * Hook to filter nowcasting data based on selected filters
 * @param {Array} data - Nowcasting data
 * @param {Object} filters - Filters object
 * @returns {Object} - Filtered data
 */
export const useNowcastingFiltering = (data, filters) => {
  const {
    selectedSeverity,
    selectedAltitude,
    selectedForecast,
  } = filters;

  const filteredData = useMemo(() => {
    const filters = {
      severity: selectedSeverity,
      altitude: selectedAltitude,
      forecast: selectedForecast,
    };
    return Nowcasting.getNowcastingDataSlice({ data, filters });
  }, [
    data,
    selectedSeverity,
    selectedAltitude,
    selectedForecast,
  ]);

  return { filteredData };
}
