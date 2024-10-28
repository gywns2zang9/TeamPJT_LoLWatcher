import './App.css';
import Main from './pages/Main';
import Login from './pages/Login';
import GameRecord from './pages/GameRecord';
import Regist from './pages/Regist';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path='/'
          element={<Main />}
        />
        <Route
          path='/login'
          element={<Login />}
        />
        <Route
          path='/records'
          element={<GameRecord />}
        />
        <Route
          path='/regist'
          element={<Regist />}
        />
      </Routes>
    </Router>
  );
}

export default App;
