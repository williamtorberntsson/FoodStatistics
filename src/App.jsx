import { HashRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import StatisticsPage from "./pages/StatisticsPage";
import BattlePage from "./pages/BattlePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/statistics" element={<StatisticsPage />} />
        <Route path="/battle" element={<BattlePage />} />
      </Routes>
    </Router>
  );
}

export default App;
