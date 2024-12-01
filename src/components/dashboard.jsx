import React from 'react';
import './NewspaperDashboard.css'; // Import CSS for vintage newspaper style
import VintageTimeline from './charts/topics-heatmap';
import  Chord  from './charts/chord';
import JurorScatterplot from './charts/scatter';
import LineGraph from './charts/silence-line';

const NewspaperDashboard = () => {
  return (
    <div className="newspaper-dashboard">
      <header className="header">
        <h1>The Daily Verdict</h1>
        <h2>Special Report: *12 Angry Men* Jury Deliberations</h2>
        <p>Published: July 15, 1957 | Volume IX, No. 42</p>
      </header>

      {/* First row: Chord Diagram */}
      <div className="article">
        <h3>The Jury in Motion: Influence and Conflict</h3>
        <p>
          In a dramatic courtroom battle, the twelve jurors tasked with deciding the fate of a young man
          accused of murder displayed an intricate web of persuasion, resistance, and unexpected alliances.
          Our investigative team has broken down the dynamics of influence in the jury room, presenting the
          *Chord Diagram* below.
        </p>
        <div className="chart-container">
          <Chord />
        </div>
      </div>

      {/* Second row: Silence Line Chart and Vintage Timeline */}
      <div className="two-column-section">
        <div className="article">
          <h3>The Sound of Silence: Key Pauses in the Deliberations</h3>
          <p>
            Silence, they say, can be more deafening than words. As tensions rose, moments of quiet reflection or
            emotional outbursts punctuated the heated discussions. The line chart below captures these critical
            pauses and their impact.
          </p>
          <div className="chart-container">
            <LineGraph />
          </div>
        </div>

      {/* Third row: Scatter Chart */}
      <div className="article">
        <h3>Dissecting Doubt: Key Moments in the Debate</h3>
        <p>
          At critical junctures during deliberations, some jurors cast doubt on seemingly irrefutable evidence,
          prompting heated exchanges. The scatterplot below examines the points of agreement and contention
          during these pivotal moments.
        </p>
        <div className="chart-container">
          <JurorScatterplot />
        </div>
      </div>

      <footer className="footer">
        <p>
          <strong>The Daily Verdict</strong> | Reporting Justice Since 1923<br />
          *Disclaimer*: This report is a fictionalized account inspired by the classic drama *12 Angry Men*.
        </p>
      </footer>
    </div>
    </div>
  );
};

export default NewspaperDashboard;