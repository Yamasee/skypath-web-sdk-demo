import { useMemo } from "react";
import { LAYER_DEPENDENT_HINT, LAYER_LOCKED_HINT, MAP_LAYERS } from "../../lib/constants";

// OneLayer already includes observations, so the demo offers OneLayer when the account has it and Observations otherwise
const useLayerToggles = ({ sdk, layerControls, isOnelayerForecastEnabled, toggleOnelayerForecast }) => {
  const {
    isRunningForecast,
    toggleForecast,
    isAdsbRunning,
    toggleAdsbLayer,
    isRunningObservations,
    toggleObservations,
    isOneLayerRunning,
    toggleOneLayer,
  } = layerControls;

  return useMemo(() => {
    const primary = sdk.IS_ONELAYER_ENABLED
      ? [
          { name: MAP_LAYERS.ONE_LAYER, isOn: isOneLayerRunning, onToggle: toggleOneLayer },
          {
            name: MAP_LAYERS.ONE_LAYER_FORECAST,
            isOn: isOneLayerRunning && isOnelayerForecastEnabled,
            onToggle: toggleOnelayerForecast,
            isNested: true,
            isDisabled: !isOneLayerRunning,
            hint: isOneLayerRunning ? null : LAYER_DEPENDENT_HINT,
          },
        ]
      : [{ name: MAP_LAYERS.OBSERVATIONS, isOn: isRunningObservations, onToggle: toggleObservations }];

    return [
      ...primary,
      {
        name: MAP_LAYERS.FORECAST,
        isOn: isRunningForecast,
        onToggle: toggleForecast,
        isLocked: !sdk.IS_FORECAST_ENABLED,
      },
      {
        name: MAP_LAYERS.ADSB,
        isOn: isAdsbRunning,
        onToggle: toggleAdsbLayer,
        isLocked: !sdk.IS_ADSB_ENABLED,
      },
    ].map((toggle) => ({
      ...toggle,
      isDisabled: toggle.isDisabled || toggle.isLocked,
      hint: toggle.isLocked ? LAYER_LOCKED_HINT : toggle.hint || null,
    }));
  }, [
    sdk,
    isOneLayerRunning,
    toggleOneLayer,
    isOnelayerForecastEnabled,
    toggleOnelayerForecast,
    isRunningObservations,
    toggleObservations,
    isRunningForecast,
    toggleForecast,
    isAdsbRunning,
    toggleAdsbLayer,
  ]);
};

export default useLayerToggles;
