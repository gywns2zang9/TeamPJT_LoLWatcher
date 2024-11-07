import "./App.css";
import Main from "./pages/Main";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Champions from "./pages/Champions";
import Users from "./pages/Users";
import Regist from "./pages/Regist";
import ResultReport from "./pages/ResultReport";
import MyPage from "./pages/MyPage";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation
} from "react-router-dom";

function PrivateRoute({ children }: { children: JSX.Element }) {
  const location = useLocation();
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}

function App() {
  const accessToken = localStorage.getItem("accessToken");

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={accessToken ? <Navigate to="/users" replace /> : <Main />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/champions" element={<Champions />} />
        <Route path="/regist" element={<Regist />} />
        <Route
          path="/users"
          element={
            <PrivateRoute>
              <Users />
            </PrivateRoute>
          }
        />
        <Route
          path="/mypage"
          element={
            <PrivateRoute>
              <MyPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/result"
          element={
            <PrivateRoute>
              <ResultReport />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
