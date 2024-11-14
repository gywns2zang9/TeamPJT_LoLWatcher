import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";
import NavHeader from "./components/common/NavHeader"; // NavHeader 컴포넌트 추가
import Main from "./pages/Main";
import Logout from "./pages/Logout";
import Champions from "./pages/Champions";
import Users from "./pages/Users";
import ResultReport from "./pages/ResultReport";
import MyPage from "./pages/MyPage";
import Statistics from "./pages/Statistics";
import Privacy from "./pages/riot/Privacy";
import Tos from "./pages/riot/Tos";

function App() {
  return (
    <Router>
      <NavHeader />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/champions" element={<Champions />} />
        <Route path="/users" element={<Users />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/result" element={<ResultReport />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/tos" element={<Tos />} />
      </Routes>
    </Router>
  );
}

export default App;
