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

export default function GameDetail({ users }: GameDetailProps) {
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
    <div className="detail-container">
      <div className="container-header">
        <div className="header-title">
          <b>
            <span style={{ color: "blue" }}>point</span>
            <span> vs </span>
            <span style={{ color: "red" }}>point</span>
          </b>
        </div>
        <div className="header-link">
          <NavLink to="/result">ResultReport</NavLink>
        </div>
      </div>

      <div className="detail-main">
        <div className="main-position-section">
          <div className="position-box">
            <img className="position-img" src="/positions/top.png" alt="탑" />
          </div>
          <div className="position-box">
            <img className="position-img" src="/positions/jug.png" alt="정글" />
          </div>
          <div className="position-box">
            <img className="position-img" src="/positions/mid.png" alt="미드" />
          </div>
          <div className="position-box">
            <img className="position-img" src="/positions/adc.png" alt="원딜" />
          </div>
          <div className="position-box">
            <img className="position-img" src="/positions/sup.png" alt="서폿" />
          </div>
        </div>

        <div className="rotated-line"></div>

        {/* Team 100 */}
        <div className="team-section">
          {teamBlue.map((user, index) => (
            <div key={index} className="team-item" onClick={openModal}>
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
              <b className="user-point"> point </b>
            </div>
          ))}
        </div>

        <div className="rotated-line"></div>

        {/* Team 200 */}
        <div className="team-section">
          {teamRed.map((user, index) => (
            <div key={index} className="team-item" onClick={openModal}>
              <img
                src={`${CHAMPION_IMG_BASE_URL}${user.championName}.png`}
                alt={user.championName}
                className="champion-img"
              />
              <b className="user-detail">{user.summonerName}</b>
              <b className="user-detail">
                ({user.kills}/{user.deaths}/{user.assists})
              </b>

              <b className="user-point"> point </b>
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
