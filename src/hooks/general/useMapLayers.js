import useForecastFlow from "../forecast/useForecastFlow";
import useOneLayerFlow from "../oneLayer/useOneLayerFlow";
import useAdsbFlow from "../adsb/useAdsbFlow";
import useObservationsFlow from "../observations/useObservationsFlow";

const useMapLayers = ({ 
  sdk, 
  polygon, 
  options = {} 
}) => {
  const {
    selectedMinSeverity,
    selectedAltitudeDebounced,
    hours,
    forecastAlt,
    isOnelayerForecastEnabled,
    aircraftCategory,
    selectedForecast
  } = options;

  // Adsb flow
  const {
    layers: adsbLayers,
    toggle: toggleAdsbLayer,
    isProcessing: isAdsbLoading,
    isRunning: isAdsbRunning
  } = useAdsbFlow({
    sdk, 
    polygon, 
    options: {
      selectedMinSeverity,
      selectedAltitudeDebounced,
      hours,
    }
  });

  // OneLayer
  const {
    layer: oneLayer,
    toggle: toggleOneLayerFlow,
    stop: stopOneLayer,
    isProcessing: isOneLayerLoading,
    isRunning: isOneLayerRunning
  } = useOneLayerFlow({
    sdk, 
    polygon, 
    options: {
      selectedMinSeverity,
      hours,
      selectedAltitudeDebounced,
      forecastAlt,
      isOnelayerForecastEnabled,
      aircraftCategory,
      selectedForecast,
    }
  });

  // Observations
  const {
    layer: observationsLayer,
    toggle: toggleObservationsFlow,
    stop: stopObservations,
    isProcessing: isObservationsLoading,
    isRunning: isRunningObservations,
  } = useObservationsFlow({
    sdk, 
    polygon, 
    options: {
      selectedMinSeverity,
      hours,
      selectedAltitudeDebounced,
      aircraftCategory,
    }
  });

  // Forecast flow
  const {
    layer: forecastLayer,
    toggle: toggleForecast,
    isProcessing: isForecastLoading,
    isRunning: isRunningForecast
  } = useForecastFlow({
    sdk, 
    polygon, 
    options: {
      selectedMinSeverity,
      selectedAltitudeDebounced,
      selectedForecast,
    }
  });

  // OneLayer already includes observations: run one of them, not both
  const toggleOneLayer = () => {
    stopObservations();
    toggleOneLayerFlow();
  };

  const toggleObservations = () => {
    stopOneLayer();
    toggleObservationsFlow();
  };

  const layers = [
    observationsLayer,
    ...adsbLayers,
    forecastLayer,
    oneLayer,
  ].filter(Boolean);

  const isLoadingLayers = isObservationsLoading || isAdsbLoading || isOneLayerLoading || isForecastLoading;

  const layerControls = {
    isRunningForecast,
    toggleForecast,
    isAdsbRunning,
    toggleAdsbLayer,
    isRunningObservations,
    toggleObservations,
    isOneLayerRunning,
    toggleOneLayer
  };

  return {
    layers,
    isLoadingLayers,
    layerControls
  };
};

export default useMapLayers;
