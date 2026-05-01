import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import Decode from "./pages/Games/Decode";
import Matcho from "./pages/Games/Matcho";
import Catcher from "./pages/Games/Catcher";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="/decode" element={<Decode />} />
          <Route path="/matcho" element={<Matcho />} />
          <Route path="/catcher" element={<Catcher />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
