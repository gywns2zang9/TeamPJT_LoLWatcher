import "./App.css";
import Main from "./pages/Main";
import Login from "./pages/Login";
import Champions from "./pages/Champions";
import GameRecord from "./pages/GameRecord";
import Regist from "./pages/Regist";
import ResultReport from "./pages/ResultReport";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="/champions" element={<Champions />} />
        <Route path="/records" element={<GameRecord />} />
        <Route path="/regist" element={<Regist />} />
        <Route path="/result" element={<ResultReport />} />
      </Routes>
    </Router>
  );
}

export default App;
