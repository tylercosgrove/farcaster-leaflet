import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

// used to first graph the users, which was then tiled into sub-images for speed
const ImageGraph = () => {
  const canvasRef = useRef(null);

  const captureCanvas = () => {
    const canvas = canvasRef.current;
    const imgURL = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.download = "d3-image.png";
    link.href = imgURL;
    link.click();
  };

  useEffect(() => {
    fetch("tsne-vis.json")
      .then((response) => response.json())
      .then((data) => {
        const canvas = canvasRef.current;
        canvas.width = 13000;
        canvas.height = 9800;

        const context = canvas.getContext("2d");
        context.scale(2, 2);

        const xScale = d3
          .scaleLinear()
          .domain([d3.min(data, (d) => d.x), d3.max(data, (d) => d.x)])
          .range([0, 6400]);

        const yScale = d3
          .scaleLinear()
          .domain([d3.min(data, (d) => d.y), d3.max(data, (d) => d.y)])
          .range([0, 4800]);

        const radius = 32;
        data.forEach((d) => {
          const img = new Image();
          img.crossOrigin = "Anonymous";
          img.src = `/api/imageProxy?src=${encodeURIComponent(d.imageSrc)}`;
          img.onload = function () {
            const x = xScale(d.x);
            const y = yScale(d.y);

            context.save();
            context.beginPath();
            context.arc(x + radius, y + radius, radius, 0, 2 * Math.PI);
            context.clip();
            context.drawImage(img, x, y, 64, 64);
            context.restore();
          };
        });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <>
      <button onClick={captureCanvas}>Capture Canvas</button>
      <canvas ref={canvasRef} width="800" height="600"></canvas>
    </>
  );
};

export default ImageGraph;
