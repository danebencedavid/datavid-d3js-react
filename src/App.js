import logo from './logo.svg';
import './App.css';
import JurorScatterplot from './components/charts/scatter';
import TopicGraph from './components/charts/vintage_graph';
import VintageTimeline from './components/charts/topics-heatmap';
import NewspaperDashboard from './components/dashboard';
import JurorRadarCharts from './components/charts/personality-radar';
import SceneLines from './components/charts/scene-line';
import FrameChart from './components/charts/frame-intense';


function App() {
  return (
    <div className="App">
      <NewspaperDashboard/>
    </div>
  );
}

export default App;
