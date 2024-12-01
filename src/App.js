import logo from './logo.svg';
import './App.css';
import NetworkDiagram from './components/charts/influence-network';
import JurorRadarCharts from './components/charts/personality-radar';
import Dashboard from './components/dashboard';
import VintageTimeline from './components/charts/topics-heatmap';
import JurorScatterplot from './components/charts/scatter';
import VintageGraph from './components/charts/vintage_graph';
import TimelineVisualization from './components/charts/vintage_graph';
import TopicGraph from './components/charts/vintage_graph';
import LineGraph from './components/charts/silence-line';
import ChordDiagram from './components/charts/chord';

function App() {
  return (
    <div className="App">
      <LineGraph/>
      <ChordDiagram/>
    </div>
  );
}

export default App;
