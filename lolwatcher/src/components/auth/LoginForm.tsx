import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postLoginAPI } from "../../api/authApi";
import "./AuthForm.css";

interface LoginFormProps {
  toggleForm: () => void;
}

export default function LoginForm({ toggleForm }: LoginFormProps) {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!userId || !password) {
      window.alert("아이디와 비밀번호를 입력해주세요.");
      return;
    }
    try {
      await postLoginAPI(userId, password);
      navigate("/users");
    } catch (err) {
      window.alert("아이디와 비밀번호를 확인해주세요.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="form-container">
      <h1>로그인</h1>
      <div className="form-main">
        <div className="input-box">
          <input
            className="input-field"
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="아이디"
            maxLength={20}
            onKeyDown={handleKeyDown}
          />
          <input
            className="input-field"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
            maxLength={20}
            onKeyDown={handleKeyDown}
          />
        </div>
        <button className="form-button" onClick={handleLogin}>
          로그인
        </button>
      </div>

      <p onClick={toggleForm} className="toggle-msg">
        회원이 아니신가요?
        <span>회원가입</span>
      </p>
    </div>
  );
}
