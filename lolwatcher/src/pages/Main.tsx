import React, { useState, useEffect } from "react";
import { functionLogout, functionAccessToken } from "../api/authApi";
import LoginForm from "../components/auth/LoginForm";
import SignupForm from "../components/auth/SignupForm";
import "./Main.css";

export default function Main() {
  useEffect(() => {
    const handleLogout = async () => {
      const accessToken = await functionAccessToken();
      if (accessToken) {
        await functionLogout(accessToken);
      }
    };
    handleLogout();
  }, []);

  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="main-container">
      <div className="main-intro"></div>
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
