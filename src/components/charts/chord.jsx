import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const ChordDiagram = () => {
  const svgRef = useRef();
  const [data, setData] = useState([]);
  const [selectedJurorIndex, setSelectedJurorIndex] = useState(null); // State to track the selected juror

  useEffect(() => {
    // Load CSV data and set the data state
    d3.csv(process.env.PUBLIC_URL + '/data/influence.csv').then((csvData) => {
      setData(csvData);
    });
  }, []);

  useEffect(() => {
    if (data.length === 0) return;

    // Prepare unique jurors list and indexing map
    const jurors = Array.from(new Set(data.flatMap(d => [d.Influencer, d.Influenced])));
    const jurorIndex = Object.fromEntries(jurors.map((juror, index) => [juror, index]));

    const svg = d3.select(svgRef.current);
    const width = 950;
    const height = 950;
    const innerRadius = Math.min(width, height) * 0.4;
    const outerRadius = innerRadius * 1.1;

    svg.attr("viewBox", [-width / 2, -height / 2, width, height]);

    // Define color scale
    const color = d3.scaleOrdinal(d3.schemeTableau10).domain(jurors);

    // Create chord layout and matrix to represent each unique direction
    const chord = d3.chordDirected().padAngle(0.02).sortSubgroups(d3.descending);
    const matrix = Array.from({ length: jurors.length }, () => Array(jurors.length).fill(0));

    // Populate matrix with individual influence strengths
    data.forEach(d => {
      const influencerIndex = jurorIndex[d.Influencer];
      const influencedIndex = jurorIndex[d.Influenced];
      matrix[influencerIndex][influencedIndex] = +d["Influence strength"];
    });

    const chords = chord(matrix);

    // Draw outer arcs for each juror
    const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);
    const group = svg
      .append("g")
      .selectAll("g")
      .data(chords.groups)
      .join("g");

    group.append("path")
      .attr("fill", d => color(jurors[d.index]))
      .attr("d", arc)
      .style("cursor", "pointer") // Add pointer cursor to indicate interactivity
      .on("click", function (event, d) {
        const clickedIndex = d.index;

        // Toggle the selection
        if (selectedJurorIndex === clickedIndex) {
          setSelectedJurorIndex(null); // Deselect if already selected
        } else {
          setSelectedJurorIndex(clickedIndex); // Select the clicked juror
        }
      });

    group.append("title")
      .text(d => `${jurors[d.index]}: ${d.value} total influence`);

    // Add juror labels
    group.append("text")
      .each(d => (d.angle = (d.startAngle + d.endAngle) / 2))
      .attr("dy", ".35em")
      .attr("transform", d => `
        rotate(${(d.angle * 180 / Math.PI - 90)})
        translate(${outerRadius + 10})
        ${d.angle > Math.PI ? "rotate(180)" : ""}
      `)
      .attr("text-anchor", d => d.angle > Math.PI ? "end" : null)
      .text(d => jurors[d.index])
      .style("font-size", "14px");

    // Draw each influence as a separate ribbon path
    svg.append("g")
      .attr("fill-opacity", 0.7)
      .selectAll("path")
      .data(chords)
      .join("path")
      .attr("class", "ribbon") // Add class for easy selection
      .attr("fill", d => color(jurors[d.source.index]))
      .attr("stroke", d => d3.rgb(color(jurors[d.source.index])).darker())
      .attr("d", d3.ribbonArrow().radius(innerRadius)) 
      .append("title")
      .text(d =>
        `${jurors[d.source.index]} → ${jurors[d.target.index]}: ${d.source.value} influence`
      );

    if (selectedJurorIndex !== null) {
      group.selectAll("path")
        .attr("opacity", d => (d.index === selectedJurorIndex ? 1 : 0.1));

      svg.selectAll(".ribbon")
        .attr("opacity", d =>
          d.source.index === selectedJurorIndex || d.target.index === selectedJurorIndex ? 1 : 0.1
        );
    } else {
      // Reset all arcs and ribbons to full opacity
      group.selectAll("path").attr("opacity", 1);
      svg.selectAll(".ribbon").attr("opacity", 1);
    }
  }, [data, selectedJurorIndex]); // Add selectedJurorIndex as a dependency

  return <svg ref={svgRef} width={650} height={700}></svg>;
};

export default ChordDiagram;
