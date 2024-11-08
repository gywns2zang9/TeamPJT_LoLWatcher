import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { functionAccessToken } from "../api/authApi";
import LoginForm from "../components/auth/LoginForm";
import RegistForm from "../components/auth/RegistForm";
import "./Main.css";

export default function Main() {
  const navigate = useNavigate();
  useEffect(() => {
    const accesstoken = functionAccessToken();
    if (!accesstoken) {
      navigate("/users");
      return;
    }
  }, [navigate]);

  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="main-container">
      <div className="main-intro">
        <h1 className="main-title">LoL Watcher .com</h1>
      </div>
      <div className="main-form-area">
        {showLogin ? (
          <LoginForm toggleForm={() => setShowLogin(false)} />
        ) : (
          // <RegistForm toggleForm={() => setShowLogin(true)} />
          <RegistForm />
        )}
      </div>
    </div>
  );
}
