import dayjs from "dayjs";
import { GeoJsonLayer } from "deck.gl";
import { useMemo, useEffect } from "react";
import {GeoUtils} from "@skypath-io/web-sdk";
import {MAP_ONELAYER_CONFIG} from "../../config.js";
import {useOneLayerFiltering} from "./useOneLayerFiltering";
import { useHexagonsFlow } from "../hexagons/useHexagonsFlow";
import { groupByHexIdAndSelectMostSevere } from "../../lib/general-utils";

const App = ({ sdk, map, mapIsReady, options }) => {
  const { selectedMinSeverity, hours, selectedAltitudeDebounced, nowcastingAlt, aircraftCategory, selectedForecast } = options;

  // Create flow
  const flow = useMemo(() => sdk.createOneLayerFlow(), [sdk]);

  // Use flow
  const {
    data,
    updateConfig,
    toggle,
    isRunning,
    isProcessing,
  } = useHexagonsFlow(flow);

  // Update config
  useEffect(() => {
    if (!mapIsReady) return;

    const polygon = GeoUtils.getMapPolygon(map);

    updateConfig({
      polygon,
      hoursAgo: hours,
      nowcastingAlt,
      forecastTs: dayjs().add(selectedForecast, 'hour').unix(),
      aircraftCategory,
    });
  }, [aircraftCategory, hours, map, mapIsReady, nowcastingAlt, selectedForecast, updateConfig]);

  // Filter data
  const filteredData = useOneLayerFiltering(
    data,
    {
      altitudeFrom: selectedAltitudeDebounced[0],
      altitudeTo: selectedAltitudeDebounced[2],
      severity: selectedMinSeverity,
    }
  );

  // Prepare data for map
  const layerData = useMemo(() => {
    const hexagons = GeoUtils.prepareOneLayerHexagonsDataForMapHexagons({
      data: filteredData,
    });

    const hexData = groupByHexIdAndSelectMostSevere({
      hexagons,
    });

    return GeoUtils.getHexagonsFeatureCollection(
      Object.values(hexData)
    );
  }, [filteredData]);

  // Create layer
  const layer = useMemo(() => new GeoJsonLayer({
      ...MAP_ONELAYER_CONFIG,
      visible: isRunning,
      data: layerData,
    }),[isRunning, layerData]);


  return { layer, toggle, isProcessing, isRunning };
};

export default App;
