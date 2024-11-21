import React from "react";
import { useNavigate } from "react-router-dom";
import "./NavHeader.css";

export default function NavHeader() {
  const navigate = useNavigate();

  return (
    <nav className="nav-header-container">
      <ul className="nav-list">
        <li onClick={() => navigate("/users")}>전적 검색</li>
        <li onClick={() => navigate("/statistics")}>챔피언 통계</li>
        <li onClick={() => navigate("/champions")}>챔피언 정보</li>
        <li onClick={() => navigate("/")}>로그아웃</li>
      </ul>
    </nav>
  );
}
