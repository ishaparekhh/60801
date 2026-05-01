import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import Decode from "./pages/Games/Decode";
import Matcho from "./pages/Games/Matcho";
import Catcher from "./pages/Games/Catcher";
import TowerofHanoi from "./pages/Games/TowerofHanoi";
import GuesstheNumber from "./pages/Games/GuesstheNumber";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="/decode" element={<Decode />} />
          <Route path="/matcho" element={<Matcho />} />
          <Route path="/catcher" element={<Catcher />} />
          <Route path="/tower-of-hanoi" element={<TowerofHanoi />} />
          <Route path="/guess-the-number" element={<GuesstheNumber />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
