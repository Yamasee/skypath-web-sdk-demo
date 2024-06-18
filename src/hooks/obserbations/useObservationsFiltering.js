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
    if (!updateConfig) return;

    const severityArray = Array.from({ length: 5 - severity }, (_, i) => severity + i);
    updateConfig({ aircraftCategory, hours, severity: severityArray, altitudeFrom, altitudeTo, })
  }, [
    updateConfig,
    aircraftCategory,
    hours,
    severity,
    altitudeFrom,
    altitudeTo
  ]);

}
