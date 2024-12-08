import React from 'react';
import './NewspaperDashboard.css'; // Updated CSS for cohesive newspaper layout
import Chord from './charts/chord';
import RadarChart from './charts/personality-radar'; // Assume this is a radar chart component
import JurorScatterplot from './charts/scatter';
import LineGraph from './charts/silence-line';
import SceneLines from './charts/scene-line'; // Import SceneLines component

const NewspaperDashboard = () => {
  return (
    <div className="newspaper-dashboard">
      {/* Header */}
      <header className="header">
        <h1>The Daily Verdict</h1>
        <h2>Special Report: *12 Angry Men* Jury Deliberations</h2>
        <p>Published: July 15, 1957 | Volume IX, No. 42</p>
      </header>

      {/* Introduction Section */}
      <section className="introduction">
        <h3>Introduction to the Case</h3>
        <p>
          Twelve jurors, one room, and the fate of a young defendant charged with murder.
          <strong> 12 Angry Men</strong> takes us into the heated deliberation of a jury tasked
          with deciding whether to convict or acquit, in what appears to be an open-and-shut case.
        </p>
        <p>
          As personal biases, moral convictions, and the search for justice clash, the jury embarks
          on a journey of persuasion, argument, and doubt that culminates in a dramatic turning point.
          This special report delves into the intricate dynamics of the deliberation process.
        </p>
      </section>

      {/* Main Content */}
      <div className="content-columns">
        {/* Left Column */}
        <div className="column">
          <section>
            <h4>Chord Diagram</h4>
            <Chord />
            <p className="chart-description">
              The jury's web of persuasion and resistance is captured in the
              <strong> Chord Diagram</strong>. Observe how key jurors influenced their peers and
              the alliances that emerged as deliberations unfolded.
            </p>
          </section>

          <section>
            <h4>Personality Radar</h4>
            <RadarChart />
          </section>
        </div>

        {/* Right Column */}
        <div className="column">
          <section>
            <h4>Juror Dynamics Scatterplot</h4>
            <JurorScatterplot />
          </section>

          <section>
            <h4>Turning Points Over Time</h4>
            <p className="chart-description">
              Heated debates shaped the jury's decision, challenging preconceived notions of guilt and doubt.
              Below, you’ll see how silence and reflection punctuated the discussions, providing key turning points
              in the story.
            </p>
            <LineGraph />
          </section>
        </div>
      </div>

      {/* New Scene Lines Section */}
      <section className="scene-lines-section">
        <h4>Lines Spoken by Scene</h4>
        <SceneLines csvPath="data/scene_analysis.csv" /> {/* Pass appropriate path */}
        <p className="chart-description">
          Explore the intensity of each scene as reflected in the lines spoken. This visualization offers insights
          into which moments carried the most weight in the deliberation.
        </p>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>
          <strong>The Daily Verdict</strong> | Reporting Justice Since 1923<br />
          *Disclaimer*: This report is a fictionalized account inspired by the classic drama *12 Angry Men*.
        </p>
      </footer>
    </div>
  );
};

export default NewspaperDashboard;
