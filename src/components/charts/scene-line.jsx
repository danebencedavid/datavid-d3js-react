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
          ? JSON.parse(d["Lines Per Juror"].replace(/'/g, '"')) // Replace single quotes with double quotes
          : {},
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
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Tooltip div
    const tooltip = d3
      .select("body")
      .append("div")
      .style("position", "absolute")
      .style("background", "#f8f4e4")
      .style("border", "1px solid #ccc")
      .style("border-radius", "4px")
      .style("padding", "10px")
      .style("min-width", "220px") // Wider tooltip
      .style("box-shadow", "0px 3px 6px rgba(0, 0, 0, 0.1)")
      .style("font-family", "Georgia, 'Times New Roman', Times, serif")
      .style("color", "#333")
      .style("pointer-events", "none")
      .style("opacity", 0);

    // X Scale
    const x = d3
      .scaleLinear()
      .domain(d3.extent(data, d => d.scene))
      .range([0, width]);

    // Y Scale
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d.lines)])
      .range([height, 0]);

    // Add X Axis
    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x).tickFormat(d3.format("d")))
      .append("text")
      .attr("y", 40)
      .attr("x", width / 2)
      .attr("fill", "#333")
      .attr("text-anchor", "middle")
      .text("Scene Number");

    // Add Y Axis
    svg
      .append("g")
      .call(d3.axisLeft(y))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -40)
      .attr("x", -height / 2)
      .attr("fill", "#333")
      .attr("text-anchor", "middle")
      .text("Lines in Scene");

    // Create Line Generator
    const line = d3
      .line()
      .x(d => x(d.scene))
      .y(d => y(d.lines))
      .curve(d3.curveMonotoneX);

    // Append Path
    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#333")
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
      .attr("fill", "#333")
      .on("mouseover", (event, d) => {
        // Show tooltip on hover
        tooltip
          .style("opacity", 1)
          .style("left", `${event.pageX + 20}px`)
          .style("top", `${event.pageY + 20}px`)
          .html(`
            <strong>Scene:</strong> ${d.scene}<br />
            <strong>Lines:</strong> ${d.lines}<br />
            <strong>Jurors:</strong> ${d.jurors.length > 0 ? d.jurors.join(", ") : "None"}
            <svg width="200" height="150" id="tooltip-chart"></svg>
          `);

        renderBarChart(d.linesPerJuror);
      })
      .on("mouseout", () => {
        // Hide tooltip when mouse leaves
        tooltip.style("opacity", 0);
      });

    const renderBarChart = (linesPerJuror) => {
      const data = Object.entries(linesPerJuror).map(([juror, lines]) => ({
        juror,
        lines,
      }));

      const chartWidth = 200;
      const chartHeight = 150;
      const margin = { top: 10, right: 10, bottom: 30, left: 30 };

      const xScale = d3
        .scaleBand()
        .domain(data.map(d => d.juror))
        .range([margin.left, chartWidth - margin.right])
        .padding(0.1);

      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, d => d.lines)])
        .range([chartHeight - margin.bottom, margin.top]);

      const chartSvg = d3.select("#tooltip-chart");

      chartSvg.selectAll("*").remove();

      // Add bars
      chartSvg
        .selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", d => xScale(d.juror))
        .attr("y", d => yScale(d.lines))
        .attr("width", xScale.bandwidth())
        .attr("height", d => chartHeight - margin.bottom - yScale(d.lines))
        .attr("fill", "#333");

      // Add X axis
      chartSvg
        .append("g")
        .attr("transform", `translate(0, ${chartHeight - margin.bottom})`)
        .call(d3.axisBottom(xScale));

      // Add Y axis
      chartSvg
        .append("g")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(yScale));
    };
  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default SceneLines;
