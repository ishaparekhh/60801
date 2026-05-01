import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import Decode from "./pages/Games/Decode";
import Matcho from "./pages/Games/Matcho";
import Catcher from "./pages/Games/Catcher";
import TowerofHanoi from "./pages/Games/TowerofHanoi";
import Blanko from "./pages/Games/Blanko";
import Slido from "./pages/Games/Slido";
import Tetro from "./pages/Games/Tetro";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="/decode" element={<Decode />} />
          <Route path="/matcho" element={<Matcho />} />
          <Route path="/catcher" element={<Catcher />} />
          <Route path="/blanko" element={<Blanko />} />
          <Route path="/slido" element={<Slido />} />
          <Route path="/tetro" element={<Tetro />} />
          <Route path="/tower-of-hanoi" element={<TowerofHanoi />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
