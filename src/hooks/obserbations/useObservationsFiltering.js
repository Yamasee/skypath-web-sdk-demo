import {useEffect} from "react";

export const useObservationsFiltering = (updateConfig, filters) => {
  const {
    aircraftCategory,
    hours,
    severity,
    altitudeFrom,
    altitudeTo,
  } = filters;

  useEffect(() => {
    if (updateConfig) {
      const severityArray = Array.from({length: severity + 1}, (_, i) => parseFloat(i));

      updateConfig({ aircraftCategory, hours, severity: severityArray, altitudeFrom, altitudeTo, })
    }
  }, [
    updateConfig,
    aircraftCategory,
    hours,
    severity,
    altitudeFrom,
    altitudeTo
  ]);

}
