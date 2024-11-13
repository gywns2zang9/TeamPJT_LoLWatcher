import React, { useState } from "react";
import "./GameDetail.css";
import ReportModal from "./ReportModal";
import { NavLink } from "react-router-dom";

const CHAMPION_IMG_BASE_URL = process.env.REACT_APP_CHAMPION_IMG_BASE_URL;

interface User {
  championName: string;
  summonerName: string;
  teamId: number;
  kills: number;
  assists: number;
  deaths: number;
  totalMinionsKilled: number;
}

interface GameDetailProps {
  users: User[];
}

//포지션 표시
const PositionSection = () => (
  <div className="main-position-section">
    {["top", "jug", "mid", "adc", "sup"].map((position) => (
      <div key={position} className="position-box">
        <img
          className="position-img"
          src={`/positions/${position}.png`}
          alt={position}
        />
      </div>
    ))}
  </div>
);

const TeamSection = ({
  team,
  onUserClick
}: {
  team: User[];
  onUserClick: () => void;
}) => (
  <div className="team-section">
    {team.map((user, index) => (
      <div key={index} className="team-item" onClick={onUserClick}>
        <div
          className="champion-img"
          style={{
            backgroundImage: `url(${CHAMPION_IMG_BASE_URL}${user.championName}.png)`
          }}
        ></div>
        <b className="user-detail">{user.summonerName}</b>
        <b className="user-detail">
          ({user.kills}/{user.deaths}/{user.assists})
        </b>
        <b className="user-point"> 20 </b>
      </div>
    ))}
  </div>
);

export default function GameDetail({ users }: GameDetailProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 모달 열기
  const openModal = () => setIsModalOpen(true);
  // 모달 닫기
  const closeModal = () => setIsModalOpen(false);

  const teamBlue = users.filter((user) => user.teamId === 100);
  const teamRed = users.filter((user) => user.teamId === 200);

  // 임시 포인트 합산
  const teamBluePoints = teamBlue.reduce((total, user) => total + 20, 0);
  const teamRedPoints = teamRed.reduce((total, user) => total + 20, 0);

  return (
    <div className="detail-container">
      <div className="container-header">
        <div className="header-title">
          <b>
            <span style={{ color: "blue" }}>{teamBluePoints}</span>
            <span> vs </span>
            <span style={{ color: "red" }}>{teamRedPoints}</span>
          </b>
        </div>
        <div className="header-link">
          <NavLink to="/result">ResultReport</NavLink>
        </div>
      </div>

      <div className="detail-main">
        <div className="blue-team-section">
          <PositionSection />
          <TeamSection team={teamBlue} onUserClick={openModal} />
        </div>

        <div className="rotated-line"></div>

        <div className="red-team-section">
          <PositionSection />
          <TeamSection team={teamRed} onUserClick={openModal} />
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
