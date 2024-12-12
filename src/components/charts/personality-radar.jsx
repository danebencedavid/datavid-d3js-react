import React, { useState } from 'react';
import RadarChart from '../../assets/radarchart'; // Adjust the import path as necessary

// Default empty data for the radar chart
const defaultRadarData = {
  jurorName: 'Empty Chart',
  Persistence: 0,
  Empathy: 0,
  'Critical Thinking': 0,
  Aggression: 0,
  'Open-Mindedness': 0,
};

// Juror data for all jurors
const jurorsData = [
  {
    jurorName: 'Juror 1 (Foreman)',
    Persistence: 7,
    Empathy: 6,
    'Critical Thinking': 6,
    Aggression: 5,
    'Open-Mindedness': 6,
    image: 'https://danebencedavid.github.io/datavid-d3js-react/data/pics/12angrymenjuror1.jpg',
  },
  {
    jurorName: 'Juror 2',
    Persistence: 8,
    Empathy: 8,
    'Critical Thinking': 5,
    Aggression: 2,
    'Open-Mindedness': 7,
    image: 'https://danebencedavid.github.io/datavid-d3js-react/data/pics/12angrymenjuror2.jpg',
  },
  {
    jurorName: 'Juror 3',
    Persistence: 10,
    Empathy: 3,
    'Critical Thinking': 7,
    Aggression: 9,
    'Open-Mindedness': 2,
    image: 'https://danebencedavid.github.io/datavid-d3js-react/data/pics/12angrymenjuror3.jpg',
  },
  {
    jurorName: 'Juror 4',
    Persistence: 9,
    Empathy: 5,
    'Critical Thinking': 9,
    Aggression: 4,
    'Open-Mindedness': 3,
    image: 'https://danebencedavid.github.io/datavid-d3js-react/data/pics/12angrymenjuror4.jpg',
  },
  {
    jurorName: 'Juror 5',
    Persistence: 7,
    Empathy: 8,
    'Critical Thinking': 6,
    Aggression: 4,
    'Open-Mindedness': 8,
    image: 'https://danebencedavid.github.io/datavid-d3js-react/data/pics/12angrymenjuror5.jpg',
  },
  {
    jurorName: 'Juror 6',
    Persistence: 8,
    Empathy: 6,
    'Critical Thinking': 5,
    Aggression: 6,
    'Open-Mindedness': 6,
    image: 'https://danebencedavid.github.io/datavid-d3js-react/data/pics/12angrymenjuror6.jpg',
  },
  {
    jurorName: 'Juror 7',
    Persistence: 9,
    Empathy: 4,
    'Critical Thinking': 4,
    Aggression: 7,
    'Open-Mindedness': 3,
    image: 'https://danebencedavid.github.io/datavid-d3js-react/data/pics/12angrymenjuror7.jpg',
  },
  {
    jurorName: 'Juror 8',
    Persistence: 10,
    Empathy: 10,
    'Critical Thinking': 10,
    Aggression: 2,
    'Open-Mindedness': 10,
    image: 'https://danebencedavid.github.io/datavid-d3js-react/data/pics/12angrymenjuror8.jpg',
  },
  {
    jurorName: 'Juror 9',
    Persistence: 6,
    Empathy: 10,
    'Critical Thinking': 8,
    Aggression: 3,
    'Open-Mindedness': 9,
    image: 'https://danebencedavid.github.io/datavid-d3js-react/data/pics/12angrymenjuror9.jpg',
  },
  {
    jurorName: 'Juror 10',
    Persistence: 9,
    Empathy: 2,
    'Critical Thinking': 4,
    Aggression: 8,
    'Open-Mindedness': 2,
    image: 'https://danebencedavid.github.io/datavid-d3js-react/data/pics/12angrymenjuror10.jpg',
  },
  {
    jurorName: 'Juror 11',
    Persistence: 8,
    Empathy: 7,
    'Critical Thinking': 8,
    Aggression: 3,
    'Open-Mindedness': 9,
    image: 'https://danebencedavid.github.io/datavid-d3js-react/data/pics/12angrymenjuror11.jpg',
  },
  {
    jurorName: 'Juror 12',
    Persistence: 6,
    Empathy: 4,
    'Critical Thinking': 5,
    Aggression: 6,
    'Open-Mindedness': 4,
    image: 'https://danebencedavid.github.io/datavid-d3js-react/data/pics/12angrymenjuror12.jpg',
  },
];


const JurorRadarCharts = () => {
  const [selectedJuror, setSelectedJuror] = useState(defaultRadarData);

  const handleChange = (event) => {
    const jurorName = event.target.value;
    const juror = jurorsData.find(j => j.jurorName === jurorName);
    setSelectedJuror(juror || defaultRadarData);
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.header}>Select a Juror to Visualize</h3>

      <select onChange={handleChange} style={styles.dropdown}>
        <option value="">-- Select a Juror --</option>
        {jurorsData.map(juror => (
          <option key={juror.jurorName} value={juror.jurorName}>
            {juror.jurorName}
          </option>
        ))}
      </select>

      <div style={styles.chartAndImageContainer}>
        {selectedJuror.jurorName !== 'Empty Chart' && (
          <img
            src={selectedJuror.image}
            alt={`${selectedJuror.jurorName}`}
            style={styles.image}
          />
        )}

        <div style={styles.chartContainer}>
          <RadarChart jurorData={selectedJuror} width={350} height={250} />
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    margin: '20px auto',
    maxWidth: '400px',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    fontSize: '16px',
    marginBottom: '10px',
    fontWeight: 'bold',
  },
  dropdown: {
    padding: '8px',
    fontSize: '14px',
    marginBottom: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  chartAndImageContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '20px',
    marginTop: '20px',
  },
  image: {
    width: '150px',
    height: '150px',
    objectFit: 'cover',
    borderRadius: '8px',
    border: '1px solid #ccc',
  },
  chartContainer: {
    display: 'inline-block',
  },
};

export default JurorRadarCharts;