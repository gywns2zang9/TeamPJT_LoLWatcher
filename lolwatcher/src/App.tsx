import "./App.css";
import Main from "./pages/Main";
import GameRecord from "./pages/GameRecord";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/records" element={<GameRecord />} />
      </Routes>
    </Router>
  );
}

export default App;
