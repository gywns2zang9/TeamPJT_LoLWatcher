import React, { useState, useEffect } from "react";
import "./GameList.css";
import GameDetail from "./GameDetail";

const CHAMPION_IMG_BASE_URL = process.env.REACT_APP_CHAMPION_IMG_BASE_URL;

interface User {
  championName: string; //"Hecarim"
  summonerName: string; //"카림sk"
  teamId: number; // 100 or 200
  kills: number;
  assists: number;
  deaths: number;
  totalMinionsKilled: number;
}

interface GameInfo {
  id: number;
  gameDuration: number; // 초단위
  gameEndStamp: number; // 밀리초 단위 유닉스 타임스탬프
  win: boolean; // true or false
  users: User[]; // Array(10)
  mainUser: User | null; // mainUser 추가
}

interface GameListProps {
  gameInfos: GameInfo[];
}

export default function GameList({ gameInfos }: GameListProps) {
  const [selectedInfoId, setSelectedInfoId] = useState<number | null>(null);

  const handleClick = (id: number) => {
    setSelectedInfoId(id === selectedInfoId ? null : id);
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

  return (
    <div className="list-container">
      <h2 className="list-container-title">게임 목록</h2>
      {gameInfos.map((info) => (
        <React.Fragment key={info.id}>
          <div
            className={`list-item ${
              info.win ? "win-background" : "lose-background"
            }`}
            onClick={() => handleClick(info.id)}
          >
            <div className="item-match-section">
              <div className="match-end-time">
                {formatKoreaTime(info.gameEndStamp)}
              </div>
              <div className="match-data">
                <p>
                  {info.win ? "승" : "패"}
                  <span className="match-type">개인?자유?</span>
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
          {selectedInfoId === info.id && <GameDetail users={info.users} />}
        </React.Fragment>
      ))}
    </div>
  );
}
