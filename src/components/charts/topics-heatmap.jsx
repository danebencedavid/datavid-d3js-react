import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const VintageTimeline = ({ csvPath }) => {
  const svgRef = useRef();
  const [data, setData] = useState([]);
  const [tooltipContent, setTooltipContent] = useState("");
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Load and parse the CSV data
    d3.csv(process.env.PUBLIC_URL + '/data/arguments.csv').then(parsedData => {
      const formattedData = parsedData.map(d => ({
        topic: d.Topic,
        start: +d["Time Start (min)"],
        end: +d["Time End (min)"],
        duration: +d["Duration (min)"],
        intensity: +d["Intensity (1-5)"],
        keyJurors: d["Key Jurors Involved"],
        description: d.Description
      }));
      setData(formattedData);
    });
  }, [csvPath]);

  useEffect(() => {
    if (data.length === 0) return;

    const margin = { top: 60, right: 30, bottom: 60, left: 30 };
    const width = 250; // Width for vertical layout
    const height = 2000; // Increase height for scrolling

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    svg.selectAll('*').remove();

    // Set the y-scale to start from the top
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.start + d.duration)]) // Domain from 0 to max duration
      .range([margin.top, height - margin.bottom]); // Map to SVG height from top to bottom

    // Dot color scale for intensity
    const colorScale = d3.scaleSequential()
      .domain([1, 5])
      .interpolator(d3.interpolateGreys);

    // Timeline line (vertical)
    svg.append("line")
      .attr("x1", width / 2) // Centered horizontally
      .attr("x2", width / 2) // Centered horizontally
      .attr("y1", margin.top)
      .attr("y2", height - margin.bottom)
      .attr("stroke", "#333")
      .attr("stroke-width", 1.5);

    // Render each topic as a dot on the timeline
    svg.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", width / 2) // Centered horizontally
      .attr("cy", d => yScale(d.start)) // Position based on the start time
      .attr("r", d => d.intensity * 3)
      .attr("fill", d => colorScale(d.intensity))
      .attr("stroke", "#000")
      .attr("stroke-width", 1.5)
      .on("mouseover", function(event, d) {
        setTooltipContent(d.description);
        setTooltipPosition({ x: event.pageX, y: event.pageY });
        setShowTooltip(true);
      })
      .on("mouseout", function() {
        setShowTooltip(false);
      });

    // Labels for each topic on the left side
    svg.selectAll("foreignObject.topic-label")
      .data(data)
      .enter()
      .append("foreignObject")
      .attr("x", width / 2 - 120) // Positioned on the left
      .attr("y", d => yScale(d.start) - 20) // Position above the circle
      .attr("width", 100) // Width for text wrapping
      .attr("height", 40) // Height to allow two lines
      .append("xhtml:div")
      .style("font-size", "10px")
      .style("font-weight", "bold")
      .style("color", "#333")
      .style("text-align", "left") // Align text to the left
      .style("line-height", "1.2em")
      .style("font-family", "Georgia, serif")
      .text(d => d.topic);

    // Sub-labels for juror names on the right side
    svg.selectAll("text.jurors")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "jurors")
      .attr("x", width / 2 + 20) // Positioned on the right
      .attr("y", d => yScale(d.start) + 5) // Position slightly below the circle
      .attr("text-anchor", "start")
      .attr("font-size", "9px")
      .attr("fill", "#555")
      .text(d => d.keyJurors.split(', ').slice(0, 3).join(", ")); 

  }, [data]);

  return (
    <div style={{ fontFamily: 'Georgia, serif', color: '#333', padding: '20px', overflowY: 'auto' }}>
      <svg ref={svgRef} />
      {showTooltip && (
        <div
          style={{
            position: "absolute",
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            border: "1px solid #ccc",
            padding: "5px",
            fontSize: "12px",
            color: "#333",
            maxWidth: "200px",
            pointerEvents: "none"
          }}
        >
          {tooltipContent}
        </div>
      )}
    </div>
  );
};

export default VintageTimeline;
