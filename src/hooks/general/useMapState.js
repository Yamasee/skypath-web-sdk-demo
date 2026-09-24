import { useState, useMemo, useCallback } from 'react';
import { Observations } from '@skypath-io/web-sdk';
import { ALTITUDE_SLIDER_INITIAL_VALUE } from '../../config';
import useDebouncedValue from './useDebouncedValue';

const useMapState = () => {
  const [map, setMap] = useState(null);
  const [polygon, setPolygon] = useState(null);
  const [isOnelayerForecastEnabled, setIsOnelayerForecastEnabled] = useState(true);
  const mapIsReady = useMemo(() => map?.loaded(), [map]);

  const [selectedForecast, setSelectedForecast] = useState(0);
  const [selectedMinSeverity, setSelectedMinSeverity] = useState(
    Observations.availableConfigInputs.severity.smooth
  );
  const [aircraftCategory, setAircraftCategory] = useState(
    Observations.availableConfigInputs.aircraftCategory.C60
  );
  const [hours, setHours] = useState(
    Observations.availableConfigInputs.hours.twoHours
  );
  const [selectedAltitude, setSelectedAltitude] = useState(
    ALTITUDE_SLIDER_INITIAL_VALUE
  );

  const selectedAltitudeDebounced = useDebouncedValue(selectedAltitude);

  const [bottomAlt, forecastAlt, topAlt] = selectedAltitude;

  const handleLoadMap = useCallback(({ target }) => setMap(target), []);
  const handleSetAircraftCategory = useCallback((value) => setAircraftCategory(value), []);
  const handleAltitudeChange = useCallback((value) => setSelectedAltitude(value), []);

  return {
    map,
    setMap,
    polygon,
    setPolygon,
    mapIsReady,
    selectedForecast,
    setSelectedForecast,
    selectedMinSeverity,
    setSelectedMinSeverity,
    aircraftCategory,
    setAircraftCategory,
    hours,
    setHours,
    selectedAltitude,
    selectedAltitudeDebounced,
    bottomAlt,
    forecastAlt,
    topAlt,
    isOnelayerForecastEnabled,
    setIsOnelayerForecastEnabled,

    handleLoadMap,
    handleSetAircraftCategory,
    handleAltitudeChange
  };
};

export default useMapState;
