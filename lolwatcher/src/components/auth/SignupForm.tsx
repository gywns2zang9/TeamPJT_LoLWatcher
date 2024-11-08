import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { functionAccessToken, postLoginAPI } from "../../api/authApi";
import { postSignupAPI } from "../../api/authApi";
import "./AuthForm.css";

interface SignupFormProps {
  toggleForm: () => void;
}

export default function SignupForm({ toggleForm }: SignupFormProps) {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [riotId, setRiotId] = useState("test");
  const [riotPassword, setRiotPassword] = useState("test");
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !password) {
      window.alert("아이디와 비밀번호를 입력해주세요.");
      return;
    }
    try {
      console.log("회원가입 시도");
      await postSignupAPI(userId, password, riotId, riotPassword);
      console.log("회원가입 성공");
      console.log("로그인 시도");
      await postLoginAPI(userId, password);
      window.alert("안녕하세요.");
      navigate("/users");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="form-container">
      <h1>회원가입</h1>
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
        <button className="form-button" onClick={handleSignup}>
          회원가입
        </button>
      </div>

      <p onClick={toggleForm} className="toggle-msg">
        기존 회원이신가요?
        <span>로그인</span>
      </p>
    </div>
  );
}
