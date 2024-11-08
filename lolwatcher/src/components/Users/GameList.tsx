import React, { useState, useEffect } from "react";
import axios from "axios";
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
  name: string; //카림sk
  tag: string; //kr1
}

export default function GameList({ name, tag }: GameListProps) {
  const [loading, setLoading] = useState(true);
  const [selectedInfoId, setSelectedInfoId] = useState<number | null>(null);
  const [infos, setInfos] = useState<GameInfo[]>([]);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.get(
          "https://lolwatcher.com/api/riot/info",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`
            },
            params: { name, tag }
          }
        );
        const data = response.data;
        console.log(data);

        // 빈도 분석을 위해 모든 게임 데이터의 summonerName을 모은 후 가장 자주 나타나는 이름을 찾습니다.
        const summonerNameCount: { [key: string]: number } = {};
        data.forEach((game: any) => {
          game.users.forEach((user: any) => {
            if (user.summonerName) {
              summonerNameCount[user.summonerName] =
                (summonerNameCount[user.summonerName] || 0) + 1;
            }
          });
        });

        const mostFrequentSummonerName = Object.keys(summonerNameCount).reduce(
          (a, b) => (summonerNameCount[a] > summonerNameCount[b] ? a : b)
        );

        const formattedInfos = data.map((item: any, index: number) => {
          const users = item.users.map((user: any) => ({
            championName: user.championName,
            summonerName: user.summonerName,
            teamId: user.teamId,
            kills: user.kills,
            assists: user.assists,
            deaths: user.deaths,
            totalMinionsKilled: user.totalMinionsKilled
          }));

          // mainUser 설정 로직
          const mainUser: User | null =
            users.find(
              (user: User) =>
                user.summonerName.replace(/\s+/g, "").toLowerCase() ===
                name.replace(/\s+/g, "").toLowerCase()
            ) ||
            users.find(
              (user: User) => user.summonerName === mostFrequentSummonerName
            ) ||
            null;

          return {
            id: index + 1,
            gameDuration: item.info.gameDuration,
            gameEndStamp: item.info.gameEndStamp,
            win: item.info.win,
            users: users,
            mainUser: mainUser // mainUser를 GameInfo에 추가
          };
        });
        setLoading(false);
        setInfos(formattedInfos);
      } catch (error) {
        console.error("데이터 가져오기 실패:", error);
      }
    };

    fetchData();
  }, [name, tag]);

  const handleClick = (id: number) => {
    setSelectedInfoId(id === selectedInfoId ? null : id);
  };

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

  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}분 ${seconds}초`;
  };

  //KDA 계산
  const calculateKDA = (kills: number, assists: number, deaths: number) => {
    return deaths === 0 ? "노데스" : ((kills + assists) / deaths).toFixed(2);
  };

  //분당 CS 계산
  const calculateCSPerMinute = (cs: number, duration: number) => {
    const minutes = duration / 60;
    return (cs / minutes).toFixed(1);
  };

  if (loading) {
    return (
      <div className="list-container">
        <h2 className="container-title">게임 목록</h2>
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="list-container">
      <h2 className="container-title">게임 목록</h2>
      {infos.map((info) => (
        <React.Fragment key={info.id}>
          <div
            className={`list-item ${
              info.win ? "win-background" : "lose-background"
            }`}
            onClick={() => handleClick(info.id)}
          >
            <div className="item-game">
              <div className="game-end-time">
                {formatKoreaTime(info.gameEndStamp)}
              </div>
              <div className="game-play">
                <p>{info.win ? "승" : "패"}</p>
                <p className="game-play-time">
                  ({formatDuration(info.gameDuration)})
                </p>
              </div>
            </div>

            {info.mainUser && (
              <div className="item-main-user">
                <img
                  src={`${CHAMPION_IMG_BASE_URL}${info.mainUser.championName}.png`}
                  alt={info.mainUser.championName}
                  className="main-user-champion"
                />
                <div className="main-user-result">
                  <p>
                    {info.mainUser.kills} / {info.mainUser.deaths} /{" "}
                    {info.mainUser.assists} (Kda:{" "}
                    {calculateKDA(
                      info.mainUser.kills,
                      info.mainUser.assists,
                      info.mainUser.deaths
                    )}
                    )
                  </p>
                  <p>
                    CS {info.mainUser.totalMinionsKilled} (분당:{" "}
                    {calculateCSPerMinute(
                      info.mainUser.totalMinionsKilled,
                      info.gameDuration
                    )}
                    )
                  </p>{" "}
                </div>
              </div>
            )}
            <div className="item-team">
              <div className="team-group">
                {info.users.slice(0, 5).map((user, index) => (
                  <div key={index} className="user-info">
                    <img
                      src={`${CHAMPION_IMG_BASE_URL}${user.championName}.png`}
                      alt={user.championName}
                      className="users-champion-img"
                    />
                    <span className="users-name">{user.summonerName}</span>
                  </div>
                ))}
              </div>

              <div className="team-group">
                {info.users.slice(5, 10).map((user, index) => (
                  <div key={index + 5} className="user-info">
                    <img
                      src={`${CHAMPION_IMG_BASE_URL}${user.championName}.png`}
                      alt={user.championName}
                      className="users-champion-img"
                    />
                    <span className="users-name">{user.summonerName}</span>
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
