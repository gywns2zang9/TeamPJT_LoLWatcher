import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import Header from "../components/common/Header";
import RecordList from "../components/games/RecordList";
import Profile from "../components/user/Profile";
import Overview from "../components/user/Overview";

import "./Users.css";

export default function Users() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const name = searchParams.get("name");
  const tag = searchParams.get("tag");

  return (
    <div className="container">
      <div className="link">
        <NavLink to="/champions">챔피언 정보</NavLink>
        <NavLink to="/logout">로그아웃</NavLink>
      </div>
      <Header />
      <div className="record-container">
        <div className="record-profile">
          {name && tag && <Profile name={name} tag={tag} />}
        </div>
        <button>새로고침</button>
        <div className="gamerecord-content">
          <Overview />
          {name && tag && <RecordList name={name} tag={tag} />}
        </div>
      </div>
    </div>
  );
}
