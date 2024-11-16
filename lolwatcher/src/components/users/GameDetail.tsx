import React, { useState } from "react";
import "./GameDetail.css";
import ReportModal from "./ReportModal";
import { NavLink } from "react-router-dom";
import { ReportInfo } from "./GameList";

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
  report: ReportInfo;
}

// 포지션 표시
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
  teamKey,
  onUserClick,
}: {
  team: User[];
  teamKey: "team_100" | "team_200";
  onUserClick: (team: "team_100" | "team_200", role: keyof ReportInfo["team_100"]) => void;
}) => {
  const roles: Array<keyof ReportInfo["team_100"]> = [
    "top",
    "jungle",
    "middle",
    "bottom",
    "utility",
  ]; // 역할 배열

  return (
    <div className="team-section">
      {team.map((user, index) => {
        const role = roles[index]; // 인덱스를 기반으로 역할 매핑
        return (
          <div key={index} className="team-item" onClick={() => onUserClick(teamKey, role)}>
            <div
              className="champion-img"
              style={{
                backgroundImage: `url(${CHAMPION_IMG_BASE_URL}${user.championName}.png)`,
              }}
            ></div>
            <b className="user-detail">{user.summonerName}</b>
            <b className="user-detail">
              ({user.kills}/{user.deaths}/{user.assists})
            </b>
            <b className="user-point"> 20 </b>
          </div>
        );
      })}
    </div>
  );
};

export default function GameDetail({ users, report }: GameDetailProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<{
    role: string;
    userName: string;
    championImgUrl: string;
    userReport: any;
    opponentReport: any;
  } | null>(null);

  const teamBlue = users.filter((user) => user.teamId === 100);
  const teamRed = users.filter((user) => user.teamId === 200);

  // 임시 포인트 합산
  const teamBluePoints = teamBlue.reduce((total, user) => total + 20, 0);
  const teamRedPoints = teamRed.reduce((total, user) => total + 20, 0);

  const handleUserClick = (team: "team_100" | "team_200", role: keyof ReportInfo["team_100"], userName: string, championImgUrl: string) => {
    const userReport = report[team][role]; // 클릭한 유저의 report
    const opponentTeam = team === "team_100" ? "team_200" : "team_100"; // 상대 팀 계산
    const opponentReport = report[opponentTeam][role]; // 상대 팀의 동일 역할 report

    // 선택한 데이터 설정
    setSelectedReport({
      role,
      userName,
      championImgUrl,
      userReport,
      opponentReport,
    });

    setIsModalOpen(true); // 모달 열기
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedReport(null); // 선택 데이터 초기화
  };

  const roles: Array<keyof ReportInfo["team_100"]> = ["top", "jungle", "middle", "bottom", "utility"];

  return (
    <div className="detail-container">
      <div className="container-header">
        <div className="header-title">
          <div className="blue-team-score">
            <span>(Red Blue Score)</span>
            {teamBluePoints}
          </div>
          <span> vs </span>
          <div className="red-team-score">
            {teamRedPoints}
            <span>(Red Team Score)</span>
          </div>
        </div>
        <div className="header-link">
          <NavLink to="/result">ResultReport</NavLink>
        </div>
      </div>

      <div className="detail-main">
        <div className="blue-team-section">
          <PositionSection />
          <div className="team-section">
            {teamBlue.map((user, index) => (
              <div
                key={index}
                className="team-item"
                onClick={() => handleUserClick("team_100", roles[index], user.summonerName, `${user.championName}.png`)}
              >
                <div
                  className="champion-img"
                  style={{
                    backgroundImage: `url(${CHAMPION_IMG_BASE_URL}${user.championName}.png)`,
                  }}
                ></div>
                <b className="user-detail">{user.summonerName}</b>
                <b className="user-detail">
                  ({user.kills}/{user.deaths}/{user.assists})
                </b>
              </div>
            ))}
          </div>
        </div>

        <div className="rotated-line"></div>

        <div className="red-team-section">
          <PositionSection />
          <div className="team-section">
            {teamRed.map((user, index) => (
              <div
                key={index}
                className="team-item"
                onClick={() => handleUserClick("team_200", roles[index], user.summonerName, `${user.championName}.png`)}
              >
                <div
                  className="champion-img"
                  style={{
                    backgroundImage: `url(${CHAMPION_IMG_BASE_URL}${user.championName}.png)`,
                  }}
                ></div>
                <b className="user-detail">{user.summonerName}</b>
                <b className="user-detail">
                  ({user.kills}/{user.deaths}/{user.assists})
                </b>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isModalOpen && selectedReport && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <ReportModal
              role={selectedReport.role}
              userName={selectedReport.userName}
              championImgUrl={selectedReport.championImgUrl}
              userReport={selectedReport.userReport}
              opponentReport={selectedReport.opponentReport}
            />
          </div>
        </div>
      )}
    </div>
  );
}
