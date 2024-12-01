import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { interpolatePath } from 'd3-interpolate-path';

const RadarChart = ({ jurorData, width = 250, height = 250 }) => {
  const svgRef = useRef();
  const previousDataRef = useRef();

  useEffect(() => {
    const levels = 5;
    const maxValue = 10;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`);

    svg.selectAll('*').remove();

    const attributes = ['Persistence', 'Empathy', 'Critical Thinking', 'Aggression', 'Open-Mindedness'];
    const angleSlice = (2 * Math.PI) / attributes.length;

    const radiusScale = d3.scaleLinear()
      .range([0, Math.min(width, height) * 0.4])
      .domain([0, maxValue]);

    const radarLine = d3.lineRadial()
      .radius(d => isNaN(d.value) ? 0 : radiusScale(d.value))
      .angle((d, i) => i * angleSlice)
      .curve(d3.curveCardinalClosed);

    const chartGroup = svg.append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    // Grid circles
    Array.from({ length: levels }, (_, i) => i + 1).forEach(level => {
      chartGroup.append('circle')
        .attr('r', radiusScale((level / levels) * maxValue))
        .attr('fill', 'none')
        .attr('stroke', '#4a4a4a')
        .attr('stroke-width', 0.6)
        .attr('stroke-dasharray', '3 2');
    });

    // Axis lines
    attributes.forEach((_, i) => {
      const x = radiusScale(maxValue) * Math.cos(angleSlice * i - Math.PI / 2);
      const y = radiusScale(maxValue) * Math.sin(angleSlice * i - Math.PI / 2);
      chartGroup.append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', x)
        .attr('y2', y)
        .attr('stroke', '#333')
        .attr('stroke-width', 1);
    });

    // Prepare data for radar area
    const radarData = attributes.map(attr => ({
      axis: attr,
      value: jurorData[attr] || 0,
    }));

    // Get previous data for smooth transition
    const previousData = previousDataRef.current || radarData;
    previousDataRef.current = radarData;

    // Radar area with animation
    const radarPath = chartGroup.append('path')
      .datum(previousData)
      .attr('d', radarLine)
      .attr('fill', '#4a4a4a')
      .attr('fill-opacity', 0.4)
      .attr('stroke', '#333')
      .attr('stroke-width', 1.5);

    // Transition to new radar area
    radarPath.transition()
      .duration(800)
      .attrTween('d', function () {
        const interpolator = interpolatePath(radarLine(previousData), radarLine(radarData));
        return t => interpolator(t);
      });

    // Labels
    radarData.forEach((d, i) => {
      const x = radiusScale(maxValue * 1.1) * Math.cos(angleSlice * i - Math.PI / 2);
      const y = radiusScale(maxValue * 1.1) * Math.sin(angleSlice * i - Math.PI / 2);
      chartGroup.append('text')
        .attr('x', x)
        .attr('y', y)
        .attr('text-anchor', 'middle')
        .style('font-size', '10px')
        .style('font-family', 'Arial, sans-serif')
        .style('fill', '#333')
        .style('font-weight', 'bold')
        .text(d.axis);
    });
  }, [jurorData, width, height]);

  return (
    <div style={{ textAlign: 'center', color: '#333', margin: '0' }}>
      <h4 style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>
        {jurorData.jurorName}
      </h4>
      <svg ref={svgRef} style={{ display: 'block', margin: '0 auto' }}></svg>
    </div>
  );
};

export default RadarChart;
