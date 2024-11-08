import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";
import Main from "./pages/Main";
import Logout from "./pages/Logout";
import Champions from "./pages/Champions";
import Users from "./pages/Users";
import ResultReport from "./pages/ResultReport";
import MyPage from "./pages/MyPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/champions" element={<Champions />} />
        <Route path="/users" element={<Users />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/result" element={<ResultReport />} />
      </Routes>
    </Router>
  );
}

export default App;
