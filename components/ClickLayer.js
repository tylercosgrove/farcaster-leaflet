import { useMap, useMapEvents } from "react-leaflet";

function transformPoint(x, y) {
  let matrix = [
    [2.1491445e-3, 3.56229235e-1, -4.61105075e1],
    [-4.89570623e-1, 2.84813833e-3, -7.66088371e1],
    [0.0, 0.0, 1.0],
  ];
  let xTransformed = matrix[0][0] * x + matrix[0][1] * y + matrix[0][2];
  let yTransformed = matrix[1][0] * x + matrix[1][1] * y + matrix[1][2];
  return { x: xTransformed, y: yTransformed };
}

const findMatchingObject = (target, arr) => {
  for (const obj of arr) {
    const xDiff = Math.abs(obj.x - target.x);
    const yDiff = Math.abs(obj.y - target.y);
    if (xDiff <= 0.5 && yDiff <= 0.5) {
      return obj;
    }
  }
  return null;
};

export default function ClickLayer({ setCurrentUser }) {
  const map = useMap();

  useMapEvents({
    click: async (e) => {
      if (map.getZoom() === 5) {
        const { lat, lng } = e.latlng;
        const converted = transformPoint(lat, lng);

        try {
          const response = await fetch("/result_metadata.json");
          if (!response.ok) throw new Error("Error fetching data");

          const data = await response.json();

          const myUser = findMatchingObject(converted, data);
          if (myUser) {
            setCurrentUser(myUser);
          }
        } catch (error) {
          console.error(error.message);
        }
      }
    },
  });

  return null;
}
