import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const NetworkDiagram = () => {
  const svgRef = useRef();
  const tooltipRef = useRef(null); 
  const [data, setData] = useState({ nodes: [], links: [] });
  const [info, setInfo] = useState(null); 
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const tooltipTimeoutRef = useRef(null);

  const nodeImages = {
    "Juror 1": "/data/pics/12angrymenjuror1.jpg",
    "Juror 2": "/data/pics/12angrymenjuror2.jpg",
    "Juror 3": "/data/pics/12angrymenjuror3.jpg",
    "Juror 4": "/data/pics/12angrymenjuror4.jpg",
    "Juror 5": "/data/pics/12angrymenjuror5.jpg",
    "Juror 6": "/data/pics/12angrymenjuror6.jpg",
    "Juror 7": "/data/pics/12angrymenjuror7.jpg",
    "Juror 8": "/data/pics/12angrymenjuror8.jpg",
    "Juror 9": "/data/pics/12angrymenjuror9.jpg",
    "Juror 10": "/data/pics/12angrymenjuror10.jpg",
    "Juror 11": "/data/pics/12angrymenjuror11.jpg",
    "Juror 12": "/data/pics/12angrymenjuror12.jpg",
  };

  useEffect(() => {
    d3.csv(process.env.PUBLIC_URL + '/data/influence.csv').then((csvData) => {
      csvData.forEach((d) => {
        d.Time = +d.Time; 
        d["Influence strength"] = +d["Influence strength"]; 
      });

      const nodes = Array.from(
        new Set(csvData.flatMap((d) => [d.Influencer, d.Influenced])),
        (name) => ({
          id: name,
          imageUrl: nodeImages[name] || null // Assign image URL from nodeImages
        })
      );

      const links = csvData.map((d) => ({
        source: nodes.find(node => node.id === d.Influencer), 
        target: nodes.find(node => node.id === d.Influenced), 
        strength: d["Influence strength"],
        method: d["Method of influence"],
        time: d.Time,
      }));

      setData({ nodes, links });
    });
  }, []);

  useEffect(() => {
    if (data.nodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    const width = 1000;
    const height = 1000;

    svg.selectAll('*').remove();

    const g = svg.append('g');

    const simulation = d3
      .forceSimulation(data.nodes)
      .force('link', d3.forceLink().id((d) => d.id).strength((d) => d.strength / 5))
      .force('charge', d3.forceManyBody().strength(-100))
      .force('center', d3.forceCenter(width / 2, height / 2));

    const link = g
      .append('g')
      .attr('stroke', '#5B5B5B')
      .attr('stroke-opacity', 0.8)
      .selectAll('line')
      .data(data.links)
      .join('line')
      .attr('stroke-width', (d) => d.strength)
      .on('click', (event, d) => {
        setInfo({
          type: 'Link',
          source: d.source.id,
          target: d.target.id,
          strength: d.strength,
          method: d.method,
          time: d.time,
        });
        setTooltipVisible(true);
        
        const [x, y] = d3.pointer(event);
        if (tooltipRef.current) {
          tooltipRef.current.style.left = `${x + 10}px`;
          tooltipRef.current.style.top = `${y + 10}px`;
        }

        clearTimeout(tooltipTimeoutRef.current);
        tooltipTimeoutRef.current = setTimeout(() => {
          setTooltipVisible(false);
        }, 1200);
      });

    const node = g
      .append('g')
      .attr('stroke', '#B0B0B0')
      .attr('stroke-width', 1.5)
      .selectAll('circle')
      .data(data.nodes)
      .join('circle')
      .attr('r', 10)
      .attr('fill', '#D9C9B5')
      .call(drag(simulation))
      .on('click', (event, d) => {
        setInfo({
          type: 'Node',
          id: d.id,
          imageUrl: d.imageUrl // Uses manually set image URL
        });
        setTooltipVisible(true);
        
        const [x, y] = d3.pointer(event);
        if (tooltipRef.current) {
          tooltipRef.current.style.left = `${x + 10}px`;
          tooltipRef.current.style.top = `${y + 10}px`;
        }

        clearTimeout(tooltipTimeoutRef.current);
        tooltipTimeoutRef.current = setTimeout(() => {
          setTooltipVisible(false);
        }, 3000);
      });

    node.append('title').text((d) => d.id);

    svg.on('mouseleave', () => {
      setTooltipVisible(false);
      clearTimeout(tooltipTimeoutRef.current);
    });

    simulation.on('tick', () => {
      link
        .attr('x1', (d) => d.source.x)
        .attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.y);

      node.attr('cx', (d) => d.x).attr('cy', (d) => d.y);
    });

    const zoom = d3.zoom()
      .scaleExtent([0.5, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    function drag(simulation) {
      function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.01).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }

      function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }

      function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }

      return d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended);
    }
  }, [data]);

  return (
    <>
      <svg ref={svgRef} width={1000} height={1000}></svg>
      {tooltipVisible && info && (
        <div
          ref={tooltipRef}
          style={{
            position: 'absolute',
            background: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid #B0B0B0',
            padding: '10px',
            pointerEvents: 'none',
            zIndex: 1000,
            transition: 'opacity 0.2s',
            boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.3)',
            fontFamily: 'Georgia, serif',
          }}
        >
          <h4 style={{ color: '#5B5B5B' }}>{info.type} Information</h4>
          {info.type === 'Node' ? (
            <>
              <p><strong>ID:</strong> {info.id}</p>
              {info.imageUrl && (
                <img 
                  src={info.imageUrl} 
                  alt={`${info.id} image`}
                  style={{
                    width: '100px',
                    height: '100px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    marginTop: '10px'
                  }}
                />
              )}
            </>
          ) : (
            <>
              <p><strong>Source:</strong> {info.source}</p>
              <p><strong>Target:</strong> {info.target}</p>
              <p><strong>Strength:</strong> {info.strength}</p>
              <p><strong>Method:</strong> {info.method}</p>
              <p><strong>Time:</strong> {info.time}</p>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default NetworkDiagram;
