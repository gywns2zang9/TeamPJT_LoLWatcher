import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { functionAccessToken } from "../api/authApi";
import LoginForm from "../components/auth/LoginForm";
import SignupForm from "../components/auth/SignupForm";
import "./Main.css";

export default function Main() {
  const navigate = useNavigate();
  useEffect(() => {
    const accesstoken = functionAccessToken();
    // 이미 로그인 한 유저면 접근 막기
    // if (!accesstoken) {
    //   navigate("/users");
    //   return;
    // }
  }, [navigate]);

  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="main-container">
      <div className="main-intro">
        {/* <h1 className="main-title">LoL Watcher .com</h1>s */}
      </div>
      <div className="main-form-area">
        {showLogin ? (
          <LoginForm toggleForm={() => setShowLogin(false)} />
        ) : (
          <SignupForm toggleForm={() => setShowLogin(true)} />
        )}
      </div>
    </div>
  );
}
