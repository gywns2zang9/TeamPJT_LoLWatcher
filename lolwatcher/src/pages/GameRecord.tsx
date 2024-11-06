import React from "react";
import { NavLink } from "react-router-dom";
import Header from "../components/common/Header";
import RecordList from "../components/games/RecordList";
import Profile from "../components/user/Profile";
import Overview from "../components/user/Overview";

import "./GameRecord.css";

export default function GameRecord() {
  return (
    <div className="container">
      <div className="link">
        <NavLink to="/champions">챔피언 정보</NavLink>
        <NavLink to="/logout">로그아웃</NavLink>
      </div>
      <Header />
      <div className="record-container">
        <div className="record-profile">
          <Profile />
        </div>
        <button>새로고침</button>
        <div className="gamerecord-content">
          <Overview />
          <RecordList />
        </div>
      </div>
    </div>
  );
}
