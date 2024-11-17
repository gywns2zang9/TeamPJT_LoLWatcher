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

export default function GameDetail({ users, report }: GameDetailProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<{
    role: string;
    userName: string;
    championImgUrl: string;
    userReport: any;
    opponentName: string;
    opponentChampionImgUrl: string;
    opponentReport: any;
  } | null>(null);

  const roles: Array<keyof ReportInfo["team_100"]> = [
    "top",
    "jungle",
    "middle",
    "bottom",
    "utility",
  ];

  const calculateScore = (
    teamKey: "team_100" | "team_200",
    role: keyof ReportInfo["team_100"]
  ): number => {
    // 역할에 해당하는 필드 가져오기
    const fields = Object.keys(report[teamKey][role]); // 필드 추출

    if (!fields || fields.length === 0) {
      return 0; // 필드가 없으면 0점 반환
    }

    // 필드 점수 합산
    const totalScore = fields.reduce((sum, field) => {
      const fieldData = report[teamKey][role][field];
      if (!fieldData || typeof fieldData.z_score !== "number") {
        return sum; // 데이터가 없으면 제외
      }

      const zScore = fieldData.z_score; // z_score 가져오기

      // Z-Score 기반 점수 계산
      const score =
        field === "deaths"
          ? Math.round(((-zScore + 3) / 6) * 100) // deaths는 반대로 계산
          : Math.round(((zScore + 3) / 6) * 100); // 일반 필드는 기본 계산

      // 점수 범위 제한
      const clampedScore = Math.min(100, Math.max(0, score));

      console.log(`Role: ${role}, Field: ${field}, Score: ${clampedScore}`);
      return sum + clampedScore; // 합산
    }, 0);

    // 평균 점수 반환
    return parseFloat((totalScore / fields.length).toFixed(1));
  };

  const calculateTeamScore = (teamKey: "team_100" | "team_200"): number => {
    const totalTeamScore = roles.reduce((sum, role) => {
      return sum + calculateScore(teamKey, role);
    }, 0);

    // 팀 점수 평균 반환
    return parseFloat((totalTeamScore / roles.length).toFixed(1));
  };

  const handleUserClick = (
    team: "team_100" | "team_200",
    role: keyof ReportInfo["team_100"],
    userName: string,
    championImgUrl: string
  ) => {
    const userReport = report[team][role];
    const opponentTeam = team === "team_100" ? "team_200" : "team_100";
    const opponentReport = report[opponentTeam][role];
    const opponentIndex = roles.indexOf(role);
    const opponentUser =
      team === "team_100"
        ? users.filter((user) => user.teamId === 200)[opponentIndex]
        : users.filter((user) => user.teamId === 100)[opponentIndex];

    setSelectedReport({
      role,
      userName,
      championImgUrl,
      userReport,
      opponentName: opponentUser.summonerName,
      opponentChampionImgUrl: `${opponentUser.championName}.png`,
      opponentReport,
    });

    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedReport(null);
  };

  const teamBlue = users.filter((user) => user.teamId === 100);
  const teamRed = users.filter((user) => user.teamId === 200);

  const teamBlueScore = calculateTeamScore("team_100");
  const teamRedScore = calculateTeamScore("team_200");

  return (
    <div className="detail-container">
      <div className="container-header">
        <div className="header-title">
          <div className="blue-team-score">
            {teamBlueScore} 점
          </div>
          <span> vs </span>
          <div className="red-team-score">
            {teamRedScore} 점
          </div>
        </div>
        <div className="header-link">
          <NavLink to="/result">ResultReport</NavLink>
        </div>
      </div>

      <div className="detail-main">
        <div className="blue-team-section">
          <div className="team-section">
            {teamBlue.map((user, index) => (
              <div
                key={index}
                className="team-item"
                onClick={() =>
                  handleUserClick(
                    "team_100",
                    roles[index],
                    user.summonerName,
                    `${user.championName}.png`
                  )
                }
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
                <b className="user-point">
                  {calculateScore("team_100", roles[index])} 점
                </b>
              </div>
            ))}
          </div>
        </div>

        <div className="rotated-line"></div>

        <div className="red-team-section">
          <div className="team-section">
            {teamRed.map((user, index) => (
              <div
                key={index}
                className="team-item"
                onClick={() =>
                  handleUserClick(
                    "team_200",
                    roles[index],
                    user.summonerName,
                    `${user.championName}.png`
                  )
                }
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
                <b className="user-point">
                  {calculateScore("team_200", roles[index])} 점
                </b>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isModalOpen && selectedReport && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div
            className={`modal-content ${isModalOpen ? "open" : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            <ReportModal
              role={selectedReport.role}
              userName={selectedReport.userName}
              championImgUrl={selectedReport.championImgUrl}
              userReport={selectedReport.userReport}
              opponentName={selectedReport.opponentName}
              opponentChampionImgUrl={selectedReport.opponentChampionImgUrl}
              opponentReport={selectedReport.opponentReport}
              onClose={closeModal}
            />
          </div>
        </div>
      )}
    </div>
  );
}
