import React, { useState, useEffect, useRef } from "react";
import "./GameList.css";
import GameDetail from "./GameDetail";

const CHAMPION_IMG_BASE_URL = process.env.REACT_APP_CHAMPION_IMG_BASE_URL;

interface User {
  championName: string; //"Garen"
  summonerName: string; //"카림sk"
  teamId: number; // 100 or 200
  kills: number;
  assists: number;
  deaths: number;
  totalMinionsKilled: number;
  tier: string;
  division: string;
  puuid: string;
}

interface GameInfo {
  id: number;
  gameDuration: number; // 초단위
  gameEndStamp: number; // 밀리초 단위 유닉스 타임스탬프
  rank: string;
  tier: string;
  division: string;
  winTeam: number;
  users: User[]; // Array(10)
  mainUser: User | null; // mainUser 추가
}

export interface ReportInfo {
  count: number;
  team_100: TeamReport;
  team_200: TeamReport;
}

interface TeamReport {
  top: any;
  jungle: any;
  middle: any;
  bottom: any;
  utility: any;
}

interface GameListProps {
  gameInfos: GameInfo[];
  reports: ReportInfo[];
}

export default function GameList({
  gameInfos,
  reports: gameReports
}: GameListProps) {
  const [selectedInfoId, setSelectedInfoId] = useState<number | null>(null);
  const [closingDetailId, setClosingDetailId] = useState<number | null>(null); // 닫히는 Detail ID
  const [contentHeight, setContentHeight] = useState<number | null>(null);
  const detailRef = useRef<HTMLDivElement | null>(null);
  
  const handleClick = (id: number) => {
    if (selectedInfoId === id) {
      // 닫기
      setContentHeight(detailRef.current?.scrollHeight || 0); // 현재 높이 설정
      setTimeout(() => setContentHeight(0), 0); // 0으로 트랜지션
      setTimeout(() => setSelectedInfoId(null), 500); // 트랜지션 후 닫기
    } else {
      // 열기
      setSelectedInfoId(id); // ID 설정
      setTimeout(() => {
        if (detailRef.current) {
          setContentHeight(detailRef.current.scrollHeight); // 콘텐츠 높이 계산
        }
      }, 0);
    }
  };

  //게임 종료 시간
  const formatKoreaTime = (timestamp: number) => {
    const koreaTime = new Date(timestamp);
    return (
      koreaTime
        .toLocaleString("ko-KR", {
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          hour12: false,
          timeZone: "Asia/Seoul"
        })
        .replace(":", "시 ") + "분"
    );
  };

  // 승리 여부 판별 함수
  const isWin = (winTeam: number, teamId: number | undefined) => {
    return winTeam === teamId;
  };

  //게임 진행 시간
  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}분 ${seconds}초`;
  };

  //KDA
  const calculateKDA = (kills: number, assists: number, deaths: number) => {
    return deaths === 0 ? "노데스" : ((kills + assists) / deaths).toFixed(2);
  };

  //분당 CS
  const calculateCSPerMinute = (cs: number, duration: number) => {
    const minutes = duration / 60;
    return (cs / minutes).toFixed(1);
  };

  useEffect(() => {
    if (selectedInfoId !== null) {
      // 새로 열릴 때
      setTimeout(() => {
        if (detailRef.current) {
          setContentHeight(detailRef.current.scrollHeight); // DOM 렌더링 후 높이 계산
        }
      }, 0);
    } else {
      // 닫힐 때
      setContentHeight(0); // 높이를 0으로 설정
    }
  }, [selectedInfoId]);

  return (
    <div className="list-container">
      <h2 className="list-container-title">게임 목록</h2>
      {gameInfos.map((info, index) => (
        <React.Fragment key={info.id}>
          <div
            className={`list-item ${
              isWin(info.winTeam, info.mainUser?.teamId)
                ? "win-background"
                : "lose-background"
            }`}
            onClick={() => handleClick(info.id)}
          >
            <div className="item-match-section">
              <div className="match-end-time">
                {formatKoreaTime(info.gameEndStamp)}
              </div>
              <div className="match-data">
                <p>
                  {isWin(info.winTeam, info.mainUser?.teamId) ? "승" : "패"}
                  <span className="match-type">{info.rank}</span>
                </p>
              </div>
              <div className="match-play-time">
                {formatDuration(info.gameDuration)}
              </div>
            </div>

            {info.mainUser && (
              <div className="item-user-section">
                <div
                  className="main-user-champion"
                  style={{
                    backgroundImage: `url(${CHAMPION_IMG_BASE_URL}${info.mainUser.championName}.png)`
                  }}
                ></div>
                <div className="main-user-data">
                  <span>
                    {info.mainUser.kills} / {info.mainUser.deaths} /{" "}
                    {info.mainUser.assists}
                  </span>
                  <span className="user-data-summary">
                    (Kda:{" "}
                    {calculateKDA(
                      info.mainUser.kills,
                      info.mainUser.assists,
                      info.mainUser.deaths
                    )}
                    )
                  </span>
                  <span>CS {info.mainUser.totalMinionsKilled}</span>
                  <span className="user-data-summary">
                    (분당:{" "}
                    {calculateCSPerMinute(
                      info.mainUser.totalMinionsKilled,
                      info.gameDuration
                    )}
                    )
                  </span>
                </div>
              </div>
            )}

            <div className="point-section">
              <div>
                ??
                <span className="point-tag">점</span>
              </div>
            </div>

            <div className="item-team-section">
              <div className="team-box">
                {info.users.slice(0, 5).map((user, index) => (
                  <div key={index} className="team-user">
                    <img
                      src={`${CHAMPION_IMG_BASE_URL}${user.championName}.png`}
                      alt={user.championName}
                      className="team-user-champion"
                    />
                    <span className="team-user-name">{user.summonerName}</span>
                  </div>
                ))}
              </div>

              <div className="team-box">
                {info.users.slice(5, 10).map((user, index) => (
                  <div key={index + 5} className="team-user">
                    <img
                      src={`${CHAMPION_IMG_BASE_URL}${user.championName}.png`}
                      alt={user.championName}
                      className="team-user-champion"
                    />
                    <span className="team-user-name">{user.summonerName}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {selectedInfoId === info.id && (
          <div
            ref={detailRef}
            className="game-detail"
            style={{
              height: contentHeight !== null ? `${contentHeight}px` : "0", // 높이를 동적으로 설정
              overflow: "hidden",
              transition: "height 0.5s ease-out",
            }}
          >
            <GameDetail users={info.users} report={gameReports[index]} />
          </div>
        )}
        </React.Fragment>
      ))}
    </div>
  );
}
