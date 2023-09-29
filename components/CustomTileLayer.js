import React, { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

const CustomTileLayer = ({ url, attribution, noWrap }) => {
  const map = useMap();

  useEffect(() => {
    const layer = L.tileLayer(url, {
      attribution: attribution,
      noWrap: noWrap,
    });

    layer.getTileUrl = function (coords) {
      const invertedY = (1 << coords.z) - coords.y - 1;
      return L.Util.template(url, { ...coords, y: invertedY });
    };

    map.addLayer(layer);
    return () => map.removeLayer(layer);
  }, [map, url, attribution, noWrap]);

  return null;
};

export default CustomTileLayer;
