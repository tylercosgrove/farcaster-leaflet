import React from "react";
import { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import CustomTileLayer from "./CustomTileLayer";
import ClickLayer from "./ClickLayer";

function transformPoint(x, y) {
  let matrix = [
    [1.63305544e-2, -2.04253453, -1.55723185e2],
    [2.80708265, 1.23226884e-2, 1.30380032e2],
    [0, 0, 1], // This row is not used in the calculation but added for completeness.
  ];
  let xTransformed = matrix[0][0] * x + matrix[0][1] * y + matrix[0][2];
  let yTransformed = matrix[1][0] * x + matrix[1][1] * y + matrix[1][2];
  return { lat: xTransformed, lng: yTransformed };
}

const MyMap = () => {
  const [searchResult, setSearchResult] = useState(null);
  const [searchUser, setSearchUser] = useState("");
  const [searchBarResults, setSearchBarResults] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const position = [-155.8, 103.7];
  const zoom = 1;

  const handleSearchClick = async (name) => {
    try {
      const response = await fetch("/result_metadata.json");
      if (!response.ok) throw new Error("Error fetching data");

      const data = await response.json();
      const user = data.find(
        (item) => item.metadata[2] === (name == "" ? searchUser : name)
      );
      if (!user) throw new Error("User abc not found");

      const transformedPoint = transformPoint(user.x, user.y);
      console.log(transformedPoint);
      setCurrentUser(user);
      setSearchResult(transformedPoint);
    } catch (error) {
      console.error(error.message);
    }
  };

  const SetBounds = ({ searchResult }) => {
    const map = useMap();

    const zoomToLocation = () => {
      if (searchResult) {
        map.flyTo(searchResult, 5);
      } else {
        // If there is no searchResult, set default position
        const defaultPosition = { lat: -155.8, lng: 103.7 };
        map.flyTo(defaultPosition, 1);
      }
    };

    useEffect(() => {
      zoomToLocation();
    }, [searchResult]);

    var mapBounds = new L.LatLngBounds(
      map.unproject([0, 8192], 5),
      map.unproject([8192, 14336], 5)
    );
    map.fitBounds(mapBounds);
    return null;
  };

  const mapContainer = useMemo(() => {
    return (
      <MapContainer
        center={position}
        zoom={zoom}
        maxZoom={5}
        style={{ height: "70vh", width: "100%" }}
        crs={L.CRS.Simple}
        onClick={(e) => {
          console.log("bruh:");
        }}
      >
        <SetBounds searchResult={searchResult} />
        <CustomTileLayer
          url="https://farcater-visualization.s3.us-east-2.amazonaws.com/out-resized-circle/{z}/{x}/{y}.png"
          noWrap={true}
        />
        <ClickLayer setCurrentUser={setCurrentUser} />
      </MapContainer>
    );
  }, [searchResult]);

  const findMatches = async (substring) => {
    if (substring.length < 3) {
      return [];
    }
    try {
      const response = await fetch("/result_metadata.json");
      if (!response.ok) throw new Error("Error fetching data");

      const data = await response.json();
      const filtered = data.filter(
        (item) =>
          item.metadata &&
          item.metadata[2] &&
          item.metadata[2].toLowerCase().includes(substring.toLowerCase())
      );
      console.log(filtered);
      return filtered;
    } catch (error) {
      console.error(error.message);
    }
    return [];
  };

  return (
    <>
      <div className="border rounded">{mapContainer}</div>
      <div className="flex flex-col-reverse items-center md:items-start md:flex-row justify-between mt-2 gap-2 mb-10 p-1">
        <div className="w-full border rounded p-2 bg-slate-100 h-fit">
          <p className="text-lg">search for user:</p>
          <input
            className="border p-2 focus:outline-none mb-2 focus:border-blue-500 rounded"
            value={searchUser}
            onChange={async (e) => {
              setSearchUser(e.target.value);
              setSearchBarResults(await findMatches(e.target.value));
            }}
          />
          <button
            className="bg-blue-500 text-white p-2 rounded cursor-pointer ml-2 hover:bg-blue-700 w-20"
            onClick={() => {
              handleSearchClick("");
            }}
          >
            find
          </button>
          {searchBarResults.map((item, index) => (
            <div
              key={index}
              className="flex bg-white p-2 border rounded items-center gap-2 mb-1 cursor-pointer hover:border-blue-500"
              onClick={() => {
                handleSearchClick(item.metadata[2]);
              }}
            >
              <img
                src={item.metadata[0]}
                className="w-10 h-10 border rounded"
              />
              <p>{item.metadata[2]}</p>
              <p className="text-slate-500 text-sm">{item.metadata[1]}</p>
            </div>
          ))}
        </div>
        {currentUser && (
          <div className="w-40 md:w-64 p-2 rounded cursor-default bg-slate-100 border">
            <p className="text-xl font-bold">{currentUser.metadata[2]}</p>
            <p className="text-sm text-slate-500">@{currentUser.metadata[1]}</p>
            <div className="square-container border rounded-lg">
              <img src={currentUser.metadata[0]} />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MyMap;

/*
const firstPoint = { lat: -223.5711, lng: 105.5257 };
  //-8.999654769897461, 33.14555740356445

  const secondPoint = { lat: -125.5, lng: 68 };
  //-22.15663719177246, -14.974050521850586

  const thirdPoint = { lat: -155.8, lng: 103.7 };
  //-9.504372596740723, -0.03838210180401802

  const fourthPoint = transformPoint(-14.719514846801758, 28.233013153076172);
 */
