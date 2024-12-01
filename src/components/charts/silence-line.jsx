import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const LineGraph = () => {
  const svgRef = useRef();
  const [data1, setData1] = useState([]);
  const [silences, setSilences] = useState([]);

  const data2 = [
    [0, 5, 1, "Jury Instructions"], [5, 10, 2, "Initial Voting"], [10, 15, 3, "Defendant's Background"], [15, 20, 3, "Knife as Evidence"],
    [20, 25, 3, "First Not Guilty Vote"], [25, 35, 4, "Eyewitness Testimony"], [35, 40, 3, "Timing of Testimony"], [40, 45, 3, "Reenactment"],
    [45, 50, 4, "Woman's glasses"], [50, 55, 3, "Defendant's Alibi"], [55, 60, 3, "Murder Sequence"], [60, 65, 4, "Reasonable doubt"],
    [65, 70, 5, "Emotional Breakdown"], [70, 75, 4, "Building tension"], [75, 80, 3, "Voting Turnaround"], [80, 90, 3, "Final Persuasions"],
    [90, 95, 3, "Final Vote"], [95, 96, 1, "Exit and Reflections"]
  ];

  useEffect(() => {
    d3.csv(process.env.PUBLIC_URL + '/data/silences-new.csv').then((csvData) => {
      const parsedData1 = [];
      const parsedSilences = [];

      csvData.forEach(row => {
        const minute = +row['Minute'];
        const numSilences = +row['Number of Silences'];
        const silenceDurations = row['Silence Durations (seconds)'] ? row['Silence Durations (seconds)'].split(',').map(d => +d.trim()) : [];

        parsedData1.push([minute, numSilences]);
        parsedSilences.push({
          silenceInfo: silenceDurations.length ? silenceDurations.join('\n') : "No silence data available"
        });
      });

      setData1(parsedData1);
      setSilences(parsedSilences);
    });
  }, []);

  useEffect(() => {
    if (!data1.length || !silences.length) return;

    const svg = d3.select(svgRef.current);
    const width = 900;
    const height = 600;
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };

    svg.selectAll("*").remove();

    const xScale = d3.scaleLinear()
      .domain([0, d3.max(data1, d => d[0])])
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data1, d => d[1])])
      .range([height - margin.bottom, margin.top]);

    // Tooltip
    const tooltip = d3.select("body").append("div")
      .style("position", "absolute")
      .style("padding", "4px")
      .style("background", "#eee")
      .style("color", "#333")
      .style("border", "1px solid #555")
      .style("border-radius", "3px")
      .style("font-family", "'Courier New', Courier, monospace")
      .style("font-size", "15px")
      .style("opacity", 0);

      svg.selectAll(".bg-rect")
  .data(data2)
  .join("rect")
  .attr("class", "bg-rect")
  .attr("x", d => xScale(d[0]) + 1) // Offset start position to create gap
  .attr("y", margin.top)
  .attr("width", d => (xScale(d[1]) - xScale(d[0])) - 1.5) // Reduce width for the gap
  .attr("height", height - margin.top - margin.bottom)
  .attr("fill", d => d3.interpolateBlues(d[2] / 5)) // Map intensity to color
  .attr("opacity", 0.5)
  .on("mouseover", (event, d) => {
    tooltip.transition().duration(200).style("opacity", 0.9);
    tooltip.html(`Topic: ${d[3]}<br>Intensity: ${d[2]}`)
      .style("left", (event.pageX + 10) + "px")
      .style("top", (event.pageY - 28) + "px");
  })
  .on("mouseout", () => tooltip.transition().duration(200).style("opacity", 0));

    
    // Axes
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale).ticks(10))
      .attr("font-size", "12px")
      .attr("color", "#333");

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale).ticks(5))
      .attr("font-size", "12px")
      .attr("color", "#333");

    // Line and circles
    const line1 = d3.line()
      .x(d => xScale(d[0]))
      .y(d => yScale(d[1]));

    svg.append("path")
      .datum(data1)
      .attr("fill", "none")
      .attr("stroke", "#333")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "3,3")
      .attr("d", line1);

    svg.selectAll(".circle1")
      .data(data1)
      .join("circle")
      .attr("class", "circle1")
      .attr("cx", d => xScale(d[0]))
      .attr("cy", d => yScale(d[1]))
      .attr("r", 3)
      .attr("fill", "#333")
      .on("mouseover", (event, d) => {
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip.html(`Time: ${d[0]}, Silences: ${d[1]}`)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", () => tooltip.transition().duration(200).style("opacity", 0))
      .on("click", (event, d) => {
        const index = data1.indexOf(d);
        const silenceInfo = silences[index]?.silenceInfo || "No silence data available";
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip.html(`Time: ${d[0]}<br>Silences: ${d[1]}<br>Details: ${silenceInfo}`)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      });

  }, [data1, silences]);

  return (
    <div style={{ padding: "20px", fontFamily: "'Courier New', Courier, monospace" }}>
      <h3 style={{ color: "#333", textAlign: "center", fontSize: "20px", fontWeight: "normal" }}>Intensity Chart</h3>
      <svg ref={svgRef} width={900} height={600} style={{ backgroundColor: "#f5f5dc", border: "1px solid #333" }}></svg>
    </div>
  );
};

export default LineGraph;
