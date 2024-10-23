import React from "react";
import Header from "../components/common/Header";
import RecordList from "../components/games/RecordList";
import Profile from "../components/user/Profile";

import "./GameRecord.css";

export default function GameRecord() {
  return (
    <div className="container">
      <Header />
      <div className="record-container">
        <Profile />
        <h1 className="title">게임 목록</h1>
        <RecordList />
      </div>
    </div>
  );
}
