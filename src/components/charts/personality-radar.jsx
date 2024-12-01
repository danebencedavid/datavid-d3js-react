import React from 'react';
import RadarChart from '../../assets/radarchart'; // Adjust the import path as necessary

// Juror data for all jurors
const jurorsData = [
  {
    jurorName: 'Juror 1 (Foreman)',
    Persistence: 7,
    Empathy: 6,
    'Critical Thinking': 6,
    Aggression: 5,
    'Open-Mindedness': 6,
  },
  {
    jurorName: 'Juror 2',
    Persistence: 8,
    Empathy: 8,
    'Critical Thinking': 5,
    Aggression: 2,
    'Open-Mindedness': 7,
  },
  {
    jurorName: 'Juror 3',
    Persistence: 10,
    Empathy: 3,
    'Critical Thinking': 7,
    Aggression: 9,
    'Open-Mindedness': 2,
  },
  {
    jurorName: 'Juror 4',
    Persistence: 9,
    Empathy: 5,
    'Critical Thinking': 9,
    Aggression: 4,
    'Open-Mindedness': 3,
  },
  {
    jurorName: 'Juror 5',
    Persistence: 7,
    Empathy: 8,
    'Critical Thinking': 6,
    Aggression: 4,
    'Open-Mindedness': 8,
  },
  {
    jurorName: 'Juror 6',
    Persistence: 8,
    Empathy: 6,
    'Critical Thinking': 5,
    Aggression: 6,
    'Open-Mindedness': 6,
  },
  {
    jurorName: 'Juror 7',
    Persistence: 9,
    Empathy: 4,
    'Critical Thinking': 4,
    Aggression: 7,
    'Open-Mindedness': 3,
  },
  {
    jurorName: 'Juror 8',
    Persistence: 10,
    Empathy: 10,
    'Critical Thinking': 10,
    Aggression: 2,
    'Open-Mindedness': 10,
  },
  {
    jurorName: 'Juror 9',
    Persistence: 6,
    Empathy: 10,
    'Critical Thinking': 8,
    Aggression: 3,
    'Open-Mindedness': 9,
  },
  {
    jurorName: 'Juror 10',
    Persistence: 9,
    Empathy: 2,
    'Critical Thinking': 4,
    Aggression: 8,
    'Open-Mindedness': 2,
  },
  {
    jurorName: 'Juror 11',
    Persistence: 8,
    Empathy: 7,
    'Critical Thinking': 8,
    Aggression: 3,
    'Open-Mindedness': 9,
  },
  {
    jurorName: 'Juror 12',
    Persistence: 6,
    Empathy: 4,
    'Critical Thinking': 5,
    Aggression: 6,
    'Open-Mindedness': 4,
  },
];

const JurorRadarCharts = () => {
  return (
    <div style={styles.container}>
      {jurorsData.map((juror) => (
        <div key={juror.jurorName} style={styles.chartContainer}>
          <RadarChart jurorData={juror} />
        </div>
      ))}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexWrap: 'wrap', // Allow wrapping to the next line if necessary
    justifyContent: 'space-between', // Space out charts evenly
    gap: '20px', // Space between radar charts
  },
  chartContainer: {
    flex: '1 1 200px', // Adjusts the size of each radar chart container
    textAlign: 'center', // Center the juror names below the charts
    padding: '10px',
    backgroundColor: '#eae6d6', // Light yellowish background to match the newspaper theme
    borderRadius: '4px', // Slight rounding for aesthetics
  }
};

export default JurorRadarCharts;
