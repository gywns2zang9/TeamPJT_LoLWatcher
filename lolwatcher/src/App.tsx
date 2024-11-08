import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";
import Main from "./pages/Main";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Champions from "./pages/Champions";
import Users from "./pages/Users";
import Regist from "./pages/Regist";
import ResultReport from "./pages/ResultReport";
import MyPage from "./pages/MyPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/champions" element={<Champions />} />
        <Route path="/regist" element={<Regist />} />
        <Route path="/users" element={<Users />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/result" element={<ResultReport />} />
      </Routes>
    </Router>
  );
}

export default App;
