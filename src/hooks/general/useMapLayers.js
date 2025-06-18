import useNowcastingFlow from "../nowcasting/useNowcastingFlow";
import useOneLayerFlow from "../oneLayer/useOneLayerFlow";
import useAdsbFlow from "../adsb/useAdsbFlow";
import useObservationsFlow from "../observations/useObservationsFlow";

const useMapLayers = ({ 
  sdk, 
  polygon, 
  options 
}) => {
  const {
    selectedMinSeverity,
    selectedAltitudeDebounced,
    hours,
    nowcastingAlt,
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
    toggle: toggleOneLayer,
    isProcessing: isOneLayerLoading,
    isRunning: isOneLayerRunning
  } = useOneLayerFlow({
    sdk, 
    polygon, 
    options: {
      selectedMinSeverity,
      hours,
      selectedAltitudeDebounced,
      nowcastingAlt,
      aircraftCategory,
      selectedForecast,
    }
  });

  // Observations
  const {
    layer: observationsLayer,
    toggle: toggleObservations,
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

  // Nowcasting flow
  const {
    layer: nowcastingLayer,
    toggle: toggleNowcasting,
    isProcessing: isNowcastingLoading,
    isRunning: isRunningNowcasting
  } = useNowcastingFlow({
    sdk, 
    polygon, 
    options: {
      selectedMinSeverity,
      selectedAltitudeDebounced,
      selectedForecast,
    }
  });

  const layers = [
    observationsLayer,
    ...adsbLayers,
    nowcastingLayer,
    oneLayer,
  ].filter(Boolean);

  const isLoadingLayers = isObservationsLoading || isAdsbLoading || isOneLayerLoading || isNowcastingLoading;

  const layerControls = {
    isRunningNowcasting,
    toggleNowcasting,
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
