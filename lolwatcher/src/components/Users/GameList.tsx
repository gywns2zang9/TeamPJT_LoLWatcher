import React, { useState, useEffect } from "react";
import axios from "axios";
import "./GameList.css";
import GameDetail from "./GameDetail";

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
  const [selectedInfoId, setSelectedInfoId] = useState<number | null>(null);
  const [infos, setInfos] = useState<GameInfo[]>([]);

  useEffect(() => {
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

          // name과 일치하는 유저를 mainUser로 설정
          const mainUser: User | null =
            users.find((user: User) => user.summonerName === name) || null;

          return {
            id: index + 1,
            gameDuration: item.info.gameDuration,
            gameEndStamp: item.info.gameEndStamp,
            win: item.info.win,
            users: users,
            mainUser: mainUser // mainUser를 GameInfo에 추가
          };
        });

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
    return koreaTime.toLocaleString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
      hour: "numeric",
      minute: "numeric",
      hour12: false,
      timeZone: "Asia/Seoul"
    });
  };

  return (
    <div className="gameList-container">
      {infos.map((info) => (
        <React.Fragment key={info.id}>
          <div className="record-item" onClick={() => handleClick(info.id)}>
            {info.id} - 게임 시간: {formatKoreaTime(info.gameEndStamp)}
            {info.mainUser && (
              <div>
                <p>메인 유저의 챔피언: {info.mainUser.championName}</p>
                <p>소환사 이름: {info.mainUser.summonerName}</p>
                <p>팀 ID: {info.mainUser.teamId}</p>
                <p>킬: {info.mainUser.kills}</p>
                <p>어시스트: {info.mainUser.assists}</p>
                <p>데스: {info.mainUser.deaths}</p>
                <p>총 미니언 처치 수: {info.mainUser.totalMinionsKilled}</p>
              </div>
            )}
          </div>
          {selectedInfoId === info.id && <GameDetail users={info.users} />}
        </React.Fragment>
      ))}
    </div>
  );
}
