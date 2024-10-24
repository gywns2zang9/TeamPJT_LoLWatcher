import React from "react";
import { NavLink } from "react-router-dom";
import Header from "../components/common/Header";
import "./Main.css";

export default function Main() {
  return (
    <div className="main-container">
      <div className="link">
        <NavLink to="/login">로그인</NavLink>
      </div>
      <Header />
      <h1>메인</h1>
    </div>
  );
}
