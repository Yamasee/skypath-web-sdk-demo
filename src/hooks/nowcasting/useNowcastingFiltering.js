import { useMemo } from "react";
import { Nowcasting } from "@yamasee/skypath-sdk-web";

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
    const filteredData = Nowcasting.getNowcastingDataSlice({ data, filters });
    return filteredData;
  }, [
    data,
    selectedSeverity,
    selectedAltitude,
    selectedForecast,
  ]);

  return { filteredData };
}
