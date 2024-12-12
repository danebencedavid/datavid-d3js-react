import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const FrameChart = ({ dataFilePath }) => {
  const chartRef = useRef();
  const [frameData, setFrameData] = useState([]);
  const [hoveredFrame, setHoveredFrame] = useState(null);

  useEffect(() => {
    // Load the JSON file
    d3.json(process.env.PUBLIC_URL + "/data/average_intensity.json")
      .then((data) => {
        setFrameData(data);
      })
      .catch((err) => {
        console.error("Error loading data:", err);
      });
  }, [dataFilePath]);

  useEffect(() => {
    if (frameData.length === 0) return;

    const svg = d3.select(chartRef.current);
    const width = 1400;
    const height = 250;

    svg.selectAll("*").remove();

    svg.attr("width", width).attr("height", height);

    const barWidth = width / frameData.length;

    const scaleIntensity = (intensity) => Math.floor((intensity / 255) * 168);

    svg
      .selectAll("rect")
      .data(frameData)
      .join("rect")
      .attr("x", (d, i) => i * barWidth)
      .attr("y", 0)
      .attr("width", barWidth)
      .attr("height", height)
      .attr("fill", (d) => {
        const adjustedIntensity = scaleIntensity(d.intensity);
        return `rgb(${adjustedIntensity}, ${adjustedIntensity}, ${adjustedIntensity})`;
      })
      .on("mouseover", function (event, d) {
        const imagePath = `${process.env.PUBLIC_URL}/${d.image.replace(/\\/g, "/")}`;
        console.log("Hovered image path:", imagePath); // Log the resolved path for debugging
        setHoveredFrame({
          ...d,
          frameNumber: d.frame, // Use the frame number from the JSON data
          image: imagePath,
        });
      })
      .on("mouseout", function () {
        setHoveredFrame(null);
      });
  }, [frameData]);

  return (
    <div>
      <svg ref={chartRef}></svg>
      {hoveredFrame && (
        <div className="frame-preview">
          <img
            src={hoveredFrame.image}
            alt="Hovered Frame"
            style={{
              width: "400px",
              height: "auto",
              border: "2px solid black",
              marginTop: "10px",
            }}
            onError={(e) => {
              console.error("Image failed to load:", hoveredFrame.image);
            }}
          />
          <p>Frame Number: {hoveredFrame.frameNumber}</p>
          <p>Intensity: {hoveredFrame.intensity.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
};

export default FrameChart;
