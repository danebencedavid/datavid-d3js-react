import React, { useState } from 'react';
import * as d3 from 'd3';

// Juror data for all jurors
const jurorsData = [
  { jurorName: 'Juror 1 (Foreman)', Persistence: 7, Empathy: 6, 'Critical Thinking': 6, Aggression: 5, 'Open-Mindedness': 6 },
  { jurorName: 'Juror 2', Persistence: 8, Empathy: 8, 'Critical Thinking': 5, Aggression: 2, 'Open-Mindedness': 7 },
  { jurorName: 'Juror 3', Persistence: 10, Empathy: 3, 'Critical Thinking': 7, Aggression: 9, 'Open-Mindedness': 2 },
  { jurorName: 'Juror 4', Persistence: 9, Empathy: 5, 'Critical Thinking': 9, Aggression: 4, 'Open-Mindedness': 3 },
  { jurorName: 'Juror 5', Persistence: 7, Empathy: 8, 'Critical Thinking': 6, Aggression: 4, 'Open-Mindedness': 8 },
  { jurorName: 'Juror 6', Persistence: 8, Empathy: 6, 'Critical Thinking': 5, Aggression: 6, 'Open-Mindedness': 6 },
  { jurorName: 'Juror 7', Persistence: 9, Empathy: 4, 'Critical Thinking': 4, Aggression: 7, 'Open-Mindedness': 3 },
  { jurorName: 'Juror 8', Persistence: 10, Empathy: 10, 'Critical Thinking': 10, Aggression: 2, 'Open-Mindedness': 10 },
  { jurorName: 'Juror 9', Persistence: 6, Empathy: 10, 'Critical Thinking': 8, Aggression: 3, 'Open-Mindedness': 9 },
  { jurorName: 'Juror 10', Persistence: 9, Empathy: 2, 'Critical Thinking': 4, Aggression: 8, 'Open-Mindedness': 2 },
  { jurorName: 'Juror 11', Persistence: 8, Empathy: 7, 'Critical Thinking': 8, Aggression: 3, 'Open-Mindedness': 9 },
  { jurorName: 'Juror 12', Persistence: 6, Empathy: 4, 'Critical Thinking': 5, Aggression: 6, 'Open-Mindedness': 4 },
];

const attributes = ['Persistence', 'Empathy', 'Critical Thinking', 'Aggression', 'Open-Mindedness'];

const Scatterplot = ({ xAttr, yAttr, data }) => {
  const svgRef = React.useRef();

  React.useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous render

    const width = 500;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 50, left: 50 };

    // Scales
    const xScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d[xAttr])])
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d[yAttr])])
      .range([height - margin.bottom, margin.top]);

    // Axis
    svg.append('g')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(xScale))
      .attr('color', '#333');

    svg.append('g')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(yScale))
      .attr('color', '#333');

    // Labels
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height - 10)
      .attr('text-anchor', 'middle')
      .text(xAttr)
      .style('font-family', 'Georgia, serif')
      .style('fill', '#333');

    svg.append('text')
      .attr('x', -height / 2)
      .attr('y', 20)
      .attr('transform', 'rotate(-90)')
      .attr('text-anchor', 'middle')
      .text(yAttr)
      .style('font-family', 'Georgia, serif')
      .style('fill', '#333');

    // Dots
    svg.selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(d[xAttr]))
      .attr('cy', d => yScale(d[yAttr]))
      .attr('r', 5)
      .attr('fill', '#555')
      .attr('stroke', '#222')
      .attr('stroke-width', '0.5')
      .style('opacity', 0.8)
      .append('title') // Tooltip with juror name
      .text(d => d.jurorName);
  }, [xAttr, yAttr, data]);

  return <svg ref={svgRef} width={500} height={400} style={{ backgroundColor: '#f5f3e6', border: '1px solid #ddd', borderRadius: '4px' }}></svg>;
};

const JurorScatterplot = () => {
  const [xAttr, setXAttr] = useState('Persistence');
  const [yAttr, setYAttr] = useState('Empathy');

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Juror Scatterplot</h2>
      <div style={styles.controls}>
        <label style={styles.label}>
          X-Axis:
          <select value={xAttr} onChange={e => setXAttr(e.target.value)} style={styles.select}>
            {attributes.map(attr => (
              <option key={attr} value={attr}>{attr}</option>
            ))}
          </select>
        </label>
        <label style={styles.label}>
          Y-Axis:
          <select value={yAttr} onChange={e => setYAttr(e.target.value)} style={styles.select}>
            {attributes.map(attr => (
              <option key={attr} value={attr}>{attr}</option>
            ))}
          </select>
        </label>
      </div>
      <Scatterplot xAttr={xAttr} yAttr={yAttr} data={jurorsData} />
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    fontFamily: 'Georgia, serif',
    backgroundColor: '#f5f3e6', // Light newspaper background color
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    boxShadow: '2px 2px 6px rgba(0, 0, 0, 0.1)',
    maxWidth: '600px',
    margin: '20px auto',
  },
  header: {
    fontSize: '1.8em',
    color: '#333',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    marginBottom: '20px',
    borderBottom: '1px solid #aaa',
    paddingBottom: '10px',
  },
  controls: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
    gap: '15px',
  },
  label: {
    fontSize: '0.9em',
    color: '#444',
    fontWeight: 'bold',
  },
  select: {
    fontSize: '0.9em',
    padding: '5px',
    fontFamily: 'Georgia, serif',
    backgroundColor: '#fdfdfb',
    color: '#333',
    border: '1px solid #bbb',
    borderRadius: '4px',
  },
};

export default JurorScatterplot;
