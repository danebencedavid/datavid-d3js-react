import React from 'react';
import NetworkDiagram from './charts/influence-network'; // Adjust path as necessary
import JurorRadarCharts from './charts/personality-radar'; 
import VintageTimeline from './charts/topics-heatmap';// Adjust path as necessary

const Dashboard = () => {
  return (
    <div style={styles.dashboard}>
      <h1 style={styles.title}>The Daily Dashboard</h1>
      <div style={styles.visualizationContainer}>
        <div style={styles.timelineContainer}>
          <h2 style={styles.sectionTitle}>Vintage Timeline</h2>
          <VintageTimeline />
        </div>
        <div style={styles.rightContainer}>
          <h2 style={styles.sectionTitle}>Juror Radar Charts</h2>
          <div style={styles.jurorRadarContainer}>
            <JurorRadarCharts />
          </div>
          <h2 style={styles.sectionTitle}>Network Diagram</h2>
          <div style={styles.networkDiagramContainer}>
            <NetworkDiagram />
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  dashboard: {
    fontFamily: '"Times New Roman", Times, serif',
    padding: '20px',
    backgroundColor: '#f4f4f4', // Light beige color for an old paper feel
    maxWidth: '1200px',
    margin: '0 auto', // Center the dashboard
    borderRadius: '5px',
    backgroundSize: 'cover',
  },
  title: {
    textAlign: 'center',
    fontSize: '2.5em', // Larger title for newspaper headline
    marginBottom: '20px',
    color: '#4a4a4a', // Dark grey for a vintage look
    textDecoration: 'underline', // Underline for a classic look
  },
  visualizationContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between', // Space between left and right containers
    gap: '20px', // Space between items
  },
  timelineContainer: {
    flex: '1 1 40%', // Take 40% of the width
    padding: '15px',
    backgroundColor: '#eae6d6', // Light yellowish background for the timeline
  },
  rightContainer: {
    flex: '1 1 55%', // Take 55% of the width
    display: 'flex',
    flexDirection: 'column',
  },
  jurorRadarContainer: {
    flex: '1 1 auto', // Automatic height based on content
    padding: '15px',
    backgroundColor: '#eae6d6', // Same light yellowish background
    marginBottom: '20px', // Space between radar charts and network diagram
  },
  networkDiagramContainer: {
    flex: '1 1 auto', // Automatic height based on content
    padding: '15px',
    backgroundColor: '#eae6d6', // Same light yellowish background
  },
  sectionTitle: {
    fontSize: '1.5em',
    marginBottom: '10px',
    paddingBottom: '5px',
    color: '#333', // Darker color for text
  },
};

export default Dashboard;
