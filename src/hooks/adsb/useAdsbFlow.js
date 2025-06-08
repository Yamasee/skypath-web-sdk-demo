import {GeoJsonLayer} from "deck.gl";
import {useEffect, useMemo} from "react";
import {MAP_ADSB_MIDDLE_CONFIG, MAP_ADSB_RING_CONFIG} from "../../config";
import {useHexagonsFlow} from "../hexagons/useHexagonsFlow";
import {useHexagonsFiltering} from "../hexagons/useHexagonsFiltering.js";
import {groupByHexIdAndSelectMostSevere} from "../../lib/general-utils.js";
import {GeoUtils} from "@skypath-io/web-sdk";

const useAdsbFlow = ({ sdk , polygon, options }) => {
  const {selectedMinSeverity, selectedAltitudeDebounced, hours } = options;

  // Create flow
  const flow = useMemo(() => sdk.createAdsbFlow(), [sdk]);

  // Use flow
  const {
    data,
    updateConfig,
    toggle,
    isRunning,
    isProcessing,
  } = useHexagonsFlow(flow);

  const { filteredData } = useHexagonsFiltering(
    data,
    {
      selectedHoursAgo: Number(hours),
      selectedAltitudeFrom: selectedAltitudeDebounced[0],
      selectedAltitudeTo: selectedAltitudeDebounced[2],
      selectedSeverity: selectedMinSeverity,
    }
  );

  // get the data in a featureCollection format
  const featureCollection = useMemo(() => {
    const hexagons = GeoUtils.prepareHexagonsDataForMapHexagons({
      data: filteredData,
    });

    const groupedAdsbData = groupByHexIdAndSelectMostSevere({
      hexagons,
    });

    const middleArea = GeoUtils.getHexagonsFeatureCollection({
      hexagons: Object.values(groupedAdsbData),
      scale: 0.5,
    });
    const ring = GeoUtils.getHexagonsFeatureCollection({
      hexagons: Object.values(groupedAdsbData),
      scale: 1,
    });
    return {
      middleArea,
      ring,
    }
    // return GeoUtils.getHexagonsFeatureCollection({ hexagons });
  }, [filteredData]);

  // Update flow config
  useEffect(() => {
    if (!polygon?.length) {
      return;
    }

    updateConfig({
      // Config
      polygon
    });
  }, [polygon, updateConfig]);

  // Create layers
  const middleAreaLayer = useMemo(() => new GeoJsonLayer(
    {
    ...MAP_ADSB_MIDDLE_CONFIG,
    visible: isRunning && !!featureCollection,
    data: featureCollection.middleArea,
  }
  ), [featureCollection, isRunning])

  const ringLayer = useMemo(() => new GeoJsonLayer(
    {
    ...MAP_ADSB_RING_CONFIG,
    visible: isRunning && !!featureCollection,
    data: featureCollection.ring,
  }
  ), [featureCollection, isRunning])


  return {
    layers: [middleAreaLayer, ringLayer],
    toggle,
    isRunning,
    isProcessing,
  };
}

export default useAdsbFlow;