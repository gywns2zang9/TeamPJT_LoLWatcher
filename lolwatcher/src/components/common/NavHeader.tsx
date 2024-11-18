import React from "react";
import { useNavigate } from "react-router-dom";
import "./NavHeader.css";

export default function NavHeader() {
  const navigate = useNavigate();

  return (
    <div className="nav-header-container">
      <div className="nav-wrapper">
        <button onClick={() => navigate("/users")}>전적 검색</button>
        <button onClick={() => navigate("/statistics")}>챔피언 통계</button>
        <button onClick={() => navigate("/champions")}>챔피언 정보</button>
        <button onClick={() => navigate("/")}>로그아웃</button>
      </div>
    </div>
  );
}
