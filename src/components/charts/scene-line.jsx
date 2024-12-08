import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const SceneLines = ({ csvPath }) => {
  const svgRef = useRef();
  const [data, setData] = useState([]);

  useEffect(() => {
    // Load the CSV file and parse the data
    d3.csv(process.env.PUBLIC_URL + "/data/scene_analysis.csv").then(rawData => {
      const parsedData = rawData.map(d => ({
        scene: +d["Scene Number"],
        lines: +d["Lines in Scene"],
        jurors: d["Jurors Present"] ? d["Jurors Present"].split(", ") : [],
        linesPerJuror: d["Lines Per Juror"]
          ? JSON.parse(
              d["Lines Per Juror"].replace(/'/g, '"') // Replace single quotes with double quotes
            )
          : {}
      }));
      setData(parsedData);
    });
  }, [csvPath]);

  useEffect(() => {
    if (data.length === 0) return;

    // Set dimensions
    const margin = { top: 20, right: 30, bottom: 50, left: 50 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Clear previous SVG content
    d3.select(svgRef.current).selectAll("*").remove();

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .attr("width",( width + margin.left + margin.right * 10))
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Tooltip div
    const tooltip = d3
      .select("body")
      .append("div")
      .style("position", "absolute")
      .style("background", "#f8f4e4") // Subtle yellow background
      .style("border", "1px solid #ccc") // Light border
      .style("border-radius", "4px")
      .style("padding", "10px")
      .style("box-shadow", "0px 3px 6px rgba(0, 0, 0, 0.1)")
      .style("font-family", "Georgia, 'Times New Roman', Times, serif")
      .style("color", "#333")
      .style("pointer-events", "none")
      .style("opacity", 0);

    // X Scale
    const x = d3
      .scaleLinear()
      .domain(d3.extent(data, d => d.scene)) // Get the min and max of the scenes
      .range([0, width * 1.3]);

    // Y Scale
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d.lines)]) // Set the range for lines
      .range([height, 0]);

    // Add X Axis
    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x).tickFormat(d3.format("d"))) // Format tick to remove decimals
      .attr("font-family", "Georgia, 'Times New Roman', Times, serif")
      .attr("font-size", "14px")
      .attr("color", "#333")
      .append("text")
      .attr("y", 40)
      .attr("x", width / 2)
      .attr("fill", "#333")
      .attr("text-anchor", "middle")
      .attr("font-weight", "bold")
      .text("Scene Number");

    // Add Y Axis
    svg
      .append("g")
      .call(d3.axisLeft(y))
      .attr("font-family", "Georgia, 'Times New Roman', Times, serif")
      .attr("font-size", "14px")
      .attr("color", "#333")
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -40)
      .attr("x", -height / 2)
      .attr("fill", "#333")
      .attr("text-anchor", "middle")
      .attr("font-weight", "bold")
      .text("Lines in Scene");

    // Create Line Generator
    const line = d3
      .line()
      .x(d => x(d.scene))
      .y(d => y(d.lines))
      .curve(d3.curveMonotoneX); // Smooth the curve

    // Append Path
    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#333") // Match the dashboard text color
      .attr("stroke-width", 2)
      .attr("d", line);

    // Add Data Points
    svg
      .selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => x(d.scene))
      .attr("cy", d => y(d.lines))
      .attr("r", 5)
      .attr("fill", "#333") // Match the dashboard text color
      .on("click", (event, d) => {
        // Show tooltip on click
        tooltip
          .style("opacity", 1)
          .html(`
            <strong style="font-size: 16px;">Scene:</strong> ${d.scene}<br />
            <strong style="font-size: 16px;">Lines:</strong> ${d.lines}<br />
            <strong style="font-size: 16px;">Jurors:</strong> ${
              d.jurors.length > 0 ? d.jurors.join(", ") : "None"
            }<br />
            <strong style="font-size: 16px;">Lines Per Juror:</strong><br />
            <ul>
              ${Object.entries(d.linesPerJuror)
                .map(([juror, lines]) => `<li>${juror}: ${lines}</li>`)
                .join("")}
            </ul>
          `)
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY + 10}px`);
      })
      .on("mouseout", () => {
        // Hide tooltip
        tooltip.style("opacity", 0);
      });

    // Add subtle styling to background to match the dashboard
    d3.select(svgRef.current)
      .style("background-color", "#f8f4e4"); // Light yellowish background
  }, [data]);

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Georgia, 'Times New Roman', Times, serif",
        backgroundColor: "#ffffff", // Matches dashboard item background
        border: "1px solid #ddd", // Light border for consistency
        borderRadius: "8px",
        boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.05)",
        margin: "10px 0"
      }}
    >
      <h3
        style={{
          textAlign: "center",
          color: "#333",
          fontWeight: "bold",
          fontSize: "24px",
          textTransform: "uppercase",
          marginBottom: "10px"
        }}
      >
        Scene Line Analysis
      </h3>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default SceneLines;
