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
    } else if (userId) {
      window.alert("현재 회원가입은 불가합니다.");
      return;
    }

    try {
      await postSignupAPI(userId, password, riotId, riotPassword);
      await postLoginAPI(userId, password);
      navigate("/users");
    } catch (err) {}
  };

  return (
    <div className="form-container">
      <h1 style={{ color: "red" }}>※회원가입 불가※</h1>
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
