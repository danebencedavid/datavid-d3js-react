import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const TopicGraph = ({ csvPath }) => {
  const svgRef = useRef();
  const [data, setData] = useState([]);
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  useEffect(() => {
    d3.csv(process.env.PUBLIC_URL + '/data/arguments.csv').then(parsedData => {
      const formattedData = parsedData.map((d, i) => ({
        id: i,
        topic: d.Topic,
        start: +d["Time Start (min)"],
        end: +d["Time End (min)"],
        duration: +d["Duration (min)"],
        intensity: +d["Intensity (1-5)"],
        keyJurors: d["Key Jurors Involved"].split(', '),
        description: d.Description
      }));
      setData(formattedData);
    });
  }, [csvPath]);

  useEffect(() => {
    if (data.length === 0) return;

    const width = 1000;
    const height = 600;
    const margin = { top: 20, right: 20, bottom: 50, left: 50 };

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    svg.selectAll('*').remove();

    // Create unique juror nodes
    const jurors = Array.from(new Set(data.flatMap(d => d.keyJurors))).map(juror => ({ id: juror }));
    
    // Links between jurors based on shared topics
    const links = [];
    data.forEach(topic => {
      const involvedJurors = topic.keyJurors;
      for (let i = 0; i < involvedJurors.length; i++) {
        for (let j = i + 1; j < involvedJurors.length; j++) {
          links.push({
            source: involvedJurors[i],
            target: involvedJurors[j],
            intensity: topic.intensity,
            time: topic.start,
            topic: topic.topic,
          });
        }
      }
    });

    // Scales for x (jurors, spread out) and y (intensity as a categorical scale)
    const xScale = d3.scalePoint()
      .domain(jurors.map(d => d.id))
      .range([margin.left, width - margin.right])
      .padding(1);

    const colorScale = d3.scaleSequential()
      .domain([0, 96])
      .interpolator(d3.interpolateGreys);

    const linkWidthScale = d3.scaleLinear()
      .domain([1, 5])
      .range([1, 4]);

    // Render links
    svg.selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("x1", d => xScale(d.source))
      .attr("y1", height / 2)
      .attr("x2", d => xScale(d.target))
      .attr("y2", height / 2)
      .attr("stroke", d => colorScale(d.time))
      .attr("stroke-width", d => linkWidthScale(d.intensity))
      .attr("opacity", d => selectedNodeId === null || d.source === selectedNodeId || d.target === selectedNodeId ? 0.8 : 0.2);

    // Render nodes (jurors)
    svg.selectAll("circle")
      .data(jurors)
      .enter()
      .append("circle")
      .attr("cx", d => xScale(d.id))
      .attr("cy", height / 2)
      .attr("r", 10)
      .attr("fill", "#4A90E2")
      .attr("stroke", "#333")
      .attr("stroke-width", 1.5)
      .attr("opacity", d => selectedNodeId === null || d.id === selectedNodeId || links.some(link => (link.source === selectedNodeId || link.target === selectedNodeId) && (link.source === d.id || link.target === d.id)) ? 1 : 0.2)
      .on("click", function(event, d) {
        setSelectedNodeId(selectedNodeId === d.id ? null : d.id);
      })
      .on("mouseover", function(event, d) {
        d3.select("#tooltip")
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY + 10}px`)
          .style("opacity", 1)
          .html(`<strong>${d.id}</strong>`);
      })
      .on("mouseout", () => {
        d3.select("#tooltip").style("opacity", 0);
      });

    // X Axis (juror names)
    svg.append("g")
      .attr("transform", `translate(0, ${height / 2 + 30})`)
      .call(d3.axisBottom(xScale).tickSize(0))
      .selectAll("text")
      .style("font-family", "Georgia, serif")
      .style("text-anchor", "middle");

    // Tooltip setup
    d3.select("body").append("div")
      .attr("id", "tooltip")
      .style("position", "absolute")
      .style("background", "#fff")
      .style("border", "1px solid #ccc")
      .style("padding", "5px")
      .style("font-family", "Georgia, serif")
      .style("font-size", "12px")
      .style("opacity", 0);

  }, [data, selectedNodeId]);

  return (
    <div style={{ fontFamily: 'Georgia, serif', color: '#333', padding: '20px' }}>
      <svg ref={svgRef} />
    </div>
  );
};

export default TopicGraph;
