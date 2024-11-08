import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postLoginAPI } from "../../api/authApi";
import "./LoginForm.css";

const LoginForm: React.FC = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      console.log("로그인 시도");
      await postLoginAPI(userId, password);
      console.log("로그인 성공");
      navigate("/users");
    } catch (err) {
      console.log("로그인 실패");
      console.log(err);
    }
  };

  const handleRegist = () => {
    clearInput();
    navigate("/regist");
  };

  const clearInput = () => {
    setUserId("");
    setPassword("");
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
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <button className="login-button" onClick={handleLogin}>
            로그인
          </button>
          <button className="login-button" onClick={handleRegist}>
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
