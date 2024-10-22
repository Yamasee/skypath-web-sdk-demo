import {  GeoUtils } from "@yamasee/skypath-sdk-web";



import axios from "axios";
import * as h3 from "h3-js";

export async function fetchAdsbData(hexIds) {
  const data = (
    await Promise.allSettled(
      hexIds.map(async (hexId) => {
        const url = `https://staging-api.skypath.io/adsb/v5/hexagons/${hexId}`;
        // const url = `http://localhost:80/adsb/v5/hexagons/${hexId}`;
        // get token from local storage
        const params = {
          hoursAgo: 2,
          minSev: 0,
          minAlt: 5,
          maxAlt: 52,
        };
        const { data: res } = await axios.get(url, { params, headers: { 'x-api-key': null } });
        const h = res?.data;
        const adsbHexagons = [];

        for (let i = 0; i < h.hexId.length; i++) {
          const cellPos = h.hexId[i];
          const hexIdRes5 = h3.childPosToCell(cellPos, hexId, 5);
          adsbHexagons.push({
            hexId: hexIdRes5,
            alt: h.alt[i],
            sev: h.sev[i],
            observationTime: h.observationTime[i],
          });
        }

        return adsbHexagons || [];
      })
    )
  )
    .filter((p) => p.status === "fulfilled")
    .map((p) => p.value);

  const adsbHexagons = data.flat();

  // group by hexId and select most severe

  const groupedHexagons = adsbHexagons.reduce((acc, hexagon) => {
    const { hexId, sev, alt, observationTime } = hexagon;
    if (!acc[hexId] || acc[hexId].sev < sev) {
      acc[hexId] = { hexId, sev, alt, observationTime };
    }
    return acc;
  }, {});

  const adsbHexagonsValues = Object.values(groupedHexagons);

  const geoJsonLayerData = GeoUtils.getHexagonsFeatureCollection(adsbHexagonsValues);

  return geoJsonLayerData;
}

