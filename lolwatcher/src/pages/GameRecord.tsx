import React from "react";
import Header from "../components/common/Header";
import RecordList from "../components/games/RecordList";
import Profile from "../components/user/Profile";
import Overview from "../components/user/Overview";

import "./GameRecord.css";

export default function GameRecord() {
  return (
    <div className="container">
      <Header />
      <div className="record-container">
        <Profile />
        <button>새로고침</button>
        <div className="gamerecord-content">
          <Overview />
          <RecordList />
        </div>
      </div>
    </div>
  );
}
