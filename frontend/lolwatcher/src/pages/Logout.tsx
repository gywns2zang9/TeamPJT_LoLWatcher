import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { functionLogout, functionAccessToken } from "../api/authApi";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      const accessToken = await functionAccessToken();
      if (accessToken) {
        await functionLogout(accessToken);
      }
      navigate("/");
    };
    handleLogout();
  }, [navigate]);

  return null;
}
