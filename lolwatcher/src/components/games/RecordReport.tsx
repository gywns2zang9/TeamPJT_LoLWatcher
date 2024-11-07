import React, { useState } from "react";
import "./RecordReport.css";
import ReportModal from "./modal/ReportModal";
import { NavLink } from "react-router-dom";

interface User {
  championName: string;
  summonerName: string;
  teamId: number;
  kills: number;
  assists: number;
  deaths: number;
  totalMinionsKilled: number;
}

interface RecordReportProps {
  users: User[];
}

export default function RecordReport({ users }: RecordReportProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 모달 열기
  const openModal = () => {
    setIsModalOpen(true);
  };

  // 모달 닫기
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const teamBlue = users.filter((user) => user.teamId === 100);
  const teamRed = users.filter((user) => user.teamId === 200);

  return (
    <div className="report-container">
      <div className="score-container">
        <div className="my-team-container">point</div>
        <div style={{ fontWeight: "bold", fontSize: "20px" }}>:</div>
        <div className="enemy-team-container">point</div>
      </div>
      <div className="link">
        <NavLink to="/result">ResultReport</NavLink>
      </div>
      <div className="report-page">
        <div className="player-position">
          <div className="position-line">탑</div>
          <div className="position-line">정글</div>
          <div className="position-line">미드</div>
          <div className="position-line">원딜</div>
          <div className="position-line">서폿</div>
        </div>
        <div className="rotated-line"></div>

        {/* Team 100 */}
        <div className="player-team">
          {teamBlue.map((user, index) => (
            <div key={index} className="team-item" onClick={openModal}>
              <div className="champion-profile">{user.championName}</div>
              <div>{user.summonerName}</div>
              <div>
                {user.kills}/{user.deaths}/{user.assists}
              </div>
            </div>
          ))}
        </div>

        <div className="rotated-line"></div>

        {/* Team 200 */}
        <div className="enemy-team">
          {teamRed.map((user, index) => (
            <div key={index} className="team-item" onClick={openModal}>
              <div>
                {user.kills}/{user.deaths}/{user.assists}
              </div>
              <div className="champion-profile">{user.championName}</div>
              <div>{user.summonerName}</div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <ReportModal />
          </div>
        </div>
      )}
    </div>
  );
}
