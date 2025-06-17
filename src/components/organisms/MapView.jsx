import DeckGL from "@deck.gl/react";
import { Map } from "react-map-gl";
import { GeoJsonLayer } from "deck.gl";
import { MAP_EQUATOR_CONFIG } from "../../config";
import { CoreUtils, GeoUtils } from "@skypath-io/web-sdk";
import { useEffect, useCallback } from "react";
import { DEBOUNCE_DELAY } from "../../lib/constants";

const MapView = ({
  map,
  mapIsReady,
  initialViewState,
  mapStyle,
  mapboxToken,
  layers,
  onLoadMap,
  setPolygon,
}) => {
  const handleMapMove = useCallback(
    CoreUtils.debounce({
      fn: () => {
        if (!mapIsReady) return;
        const currentPolygon = GeoUtils.getMapPolygon({ map });
        setPolygon(currentPolygon);
      },
      delay: DEBOUNCE_DELAY,
    }),
    [map, mapIsReady, setPolygon]
  );

  useEffect(() => {
    if (!mapIsReady) return;
    const currentPolygon = GeoUtils.getMapPolygon({ map });
    setPolygon(currentPolygon);
  }, [map, setPolygon, mapIsReady]);

  const mapLayers = [
    new GeoJsonLayer({
      ...MAP_EQUATOR_CONFIG,
    }),
    ...layers,
  ];

  return (
    <DeckGL
      initialViewState={initialViewState}
      onViewStateChange={handleMapMove}
      controller
      layers={mapLayers}
    >
      <Map
        onLoad={onLoadMap}
        mapStyle={mapStyle}
        mapboxAccessToken={mapboxToken}
      />
    </DeckGL>
  );
};

export default MapView;
