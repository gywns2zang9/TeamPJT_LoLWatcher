import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postRegistAPI } from "../../api/authApi";
import "./LoginForm.css";

const LoginForm: React.FC = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [riotId, setRiotId] = useState("");
  const [riotPassword, setRiotPassword] = useState("");
  const navigate = useNavigate();

  const handleRegist = async () => {
    try {
      console.log("회원가입 시도");
      await postRegistAPI(userId, password, riotId, riotPassword);
      console.log("회원가입 성공");
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container">
      <div className="insert-container">
        <h2 className="logo">LoLWatcher</h2>
        <div>
          <input
            className="insert"
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="아이디"
          />
        </div>
        <div>
          <input
            className="insert"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
          />
        </div>
        <div>
          <input
            className="insert"
            type="text"
            placeholder="Riot 아이디"
            value={riotId}
            onChange={(e) => setRiotId(e.target.value)}
          />
        </div>
        <div>
          <input
            className="insert"
            type="password"
            placeholder="Riot 비밀번호"
            value={riotPassword}
            onChange={(e) => setRiotPassword(e.target.value)}
          />
        </div>
        <button className="regist-button" onClick={handleRegist}>
          회원가입
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
