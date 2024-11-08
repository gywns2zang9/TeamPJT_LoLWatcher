import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { functionAccessToken, postLoginAPI } from "../../api/authApi";
import "./AuthForm.css";

interface LoginFormProps {
  toggleForm: () => void;
}

export default function LoginForm({ toggleForm }: LoginFormProps) {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !password) {
      window.alert("아이디와 비밀번호를 입력해주세요.");
      return;
    }
    try {
      console.log("로그인 시도");
      await postLoginAPI(userId, password);
      window.alert("안녕하세요.");
      navigate("/users");
    } catch (err) {
      console.log("로그인 실패");
      console.log(err);
    }
  };

  return (
    <div className="form-container">
      <h1>※로그인 안막음※</h1>
      <div className="form-main">
        <div className="input-box">
          <input
            className="input-field"
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="아이디"
            maxLength={20}
          />
          <input
            className="input-field"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
            maxLength={20}
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
