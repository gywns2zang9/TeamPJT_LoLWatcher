import React, { useState } from "react";
import "./GameDetail.css";
import ReportModal from "./ReportModal";
import { ReportInfo } from "./GameList";
import TopIcon from "../../assets/positions/top.png";
import JugIcon from "../../assets/positions/jug.png";
import MidIcon from "../../assets/positions/mid.png";
import AdcIcon from "../../assets/positions/adc.png";
import SupIcon from "../../assets/positions/sup.png";

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
  winTeam: number;
}

export default function GameDetail({
  users,
  report,
  winTeam
}: GameDetailProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<{
    role: string;
    userName: string;
    championImgUrl: string;
    userReport: any;
    opponentName: string;
    opponentChampionImgUrl: string;
    opponentReport: any;
    count: number;
  } | null>(null);

  const roles: Array<keyof ReportInfo["team_100"]> = [
    "top",
    "jungle",
    "middle",
    "bottom",
    "utility"
  ];

  const calculateScore = (
    teamKey: "team_100" | "team_200",
    role: keyof ReportInfo["team_100"]
  ): number => {
    const fields = Object.keys(report[teamKey][role]);
    if (!fields.length) return 0;

    const totalScore = fields.reduce((sum, field) => {
      const fieldData = report[teamKey][role][field];
      if (!fieldData || typeof fieldData.z_score !== "number") return sum;

      const zScore = fieldData.z_score;
      const score =
        field === "deaths"
          ? Math.round(((-zScore + 3) / 6) * 100)
          : Math.round(((zScore + 3) / 6) * 100);

      return sum + Math.min(100, Math.max(0, score));
    }, 0);

    return parseFloat((totalScore / fields.length).toFixed(1));
  };

  const getRankedUsers = (teamKey: "team_100" | "team_200") => {
    const teamUsers = users
      .filter((user) =>
        teamKey === "team_100" ? user.teamId === 100 : user.teamId === 200
      )
      .map((user, index) => ({
        ...user,
        score: calculateScore(teamKey, roles[index])
      }));

    const rankedUsers = [...teamUsers]
      .sort((a, b) => b.score - a.score)
      .map((user, rankIndex) => ({
        ...user,
        rank: rankIndex + 1
      }));

    return teamUsers.map((user) => ({
      ...user,
      rank: rankedUsers.find(
        (rankedUser) => rankedUser.summonerName === user.summonerName
      )?.rank
    }));
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

    // 상대 팀의 동일한 role을 가진 사용자를 정확히 찾기
    const opponentUser = users.find(
      (user) =>
        user.teamId === (team === "team_100" ? 200 : 100) &&
        roles[users.filter((u) => u.teamId === user.teamId).indexOf(user)] ===
          role
    );

    if (opponentUser) {
      setSelectedReport({
        role,
        userName,
        championImgUrl,
        userReport,
        opponentName: opponentUser.summonerName,
        opponentChampionImgUrl: `${opponentUser.championName}.png`,
        opponentReport,
        count: report.count
      });
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedReport(null);
  };

  const teamBlue = getRankedUsers("team_100");
  const teamRed = getRankedUsers("team_200");

  const PositionSection = () => (
    <div className="main-position-section">
      {[TopIcon, JugIcon, MidIcon, AdcIcon, SupIcon].map((icon, index) => (
        <div key={index} className="position-box">
          <img className="position-img" src={icon} alt={roles[index]} />
        </div>
      ))}
    </div>
  );

  return (
    <div className="detail-container">
      <div className="container-header">
        <div className="score-bar">
          <div
            className={`team-bar ${winTeam === 100 ? "win-bar" : "lose-bar"}`}
            style={{
              width: `${Math.round(
                (teamBlue.reduce((sum, user) => sum + user.score, 0) /
                  (teamBlue.reduce((sum, user) => sum + user.score, 0) +
                    teamRed.reduce((sum, user) => sum + user.score, 0))) *
                  100
              )}%`
            }}
          >
            <span>
              블루팀 (
              {Math.round(
                (teamBlue.reduce((sum, user) => sum + user.score, 0) /
                  (teamBlue.reduce((sum, user) => sum + user.score, 0) +
                    teamRed.reduce((sum, user) => sum + user.score, 0))) *
                  100
              )}
              %)
            </span>
          </div>
          <div
            className={`team-bar ${winTeam === 200 ? "win-bar" : "lose-bar"}`}
            style={{
              width: `${Math.round(
                (teamRed.reduce((sum, user) => sum + user.score, 0) /
                  (teamBlue.reduce((sum, user) => sum + user.score, 0) +
                    teamRed.reduce((sum, user) => sum + user.score, 0))) *
                  100
              )}%`
            }}
          >
            <span>
              레드팀 (
              {Math.round(
                (teamRed.reduce((sum, user) => sum + user.score, 0) /
                  (teamBlue.reduce((sum, user) => sum + user.score, 0) +
                    teamRed.reduce((sum, user) => sum + user.score, 0))) *
                  100
              )}
              %)
            </span>
          </div>
        </div>
      </div>

      <div className="detail-main">
        <div
          className={`blue-team-section ${winTeam === 100 ? "win" : "lose"}`}
        >
          <PositionSection />
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
                    backgroundImage: `url(${CHAMPION_IMG_BASE_URL}${user.championName}.png)`
                  }}
                ></div>
                <b className="user-detail">{user.summonerName}</b>
                <b className="user-detail">
                  {user.kills} / {user.deaths} / {user.assists}
                </b>
                <b className="user-point">
                  {user.score % 1 === 0 ? `${user.score}.0` : user.score} 점 (
                  {user.rank}등)
                </b>
              </div>
            ))}
          </div>
        </div>

        <div className={`red-team-section ${winTeam === 200 ? "win" : "lose"}`}>
          <PositionSection />
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
                    backgroundImage: `url(${CHAMPION_IMG_BASE_URL}${user.championName}.png)`
                  }}
                ></div>
                <b className="user-detail">{user.summonerName}</b>
                <b className="user-detail">
                  {user.kills} / {user.deaths} / {user.assists}
                </b>
                <b className="user-point">
                  {user.score % 1 === 0 ? `${user.score}.0` : user.score} 점 (
                  {user.rank}등)
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
              count={selectedReport.count}
              onClose={closeModal}
            />
          </div>
        </div>
      )}
    </div>
  );
}
