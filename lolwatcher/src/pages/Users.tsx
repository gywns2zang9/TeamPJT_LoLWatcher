import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import GameList from "../components/users/GameList";
import Profile from "../components/users/Profile";
import axios from "axios";
import "./Users.css";

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

interface UserInfo {
  division: string;
  leaguePoint: number;
  losses: number;
  queueType: string;
  tier: string;
  wins: number;
}

export default function Users() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  // URL의 params에서 name과 tag를 가져오거나 기본값을 설정
  const name = searchParams.get("name") || "카림sk";
  const tag = searchParams.get("tag") || "KR1";

  const [nickName, setNickName] = useState<string>("");
  const [gameInfos, setGameInfos] = useState<GameInfo[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
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
        setUserInfo(data.userInfo);

        const formattedInfos = data.matchs.map((item: any, index: number) => {
          const users = item.users.map((user: any) => ({
            championName: user.championName,
            summonerName: user.summonerName,
            teamId: user.teamId,
            kills: user.kills,
            assists: user.assists,
            deaths: user.deaths,
            totalMinionsKilled: user.totalMinionsKilled
          }));

          const mainUser: User | null =
            users.find(
              (user: User) =>
                user.summonerName.replace(/\s+/g, "").toLowerCase() ===
                name.replace(/\s+/g, "").toLowerCase()
            ) || null;

          return {
            id: index + 1,
            gameDuration: item.info.gameDuration,
            gameEndStamp: item.info.gameEndStamp,
            win: item.info.win,
            users: users,
            mainUser: mainUser
          };
        });

        setGameInfos(formattedInfos);
      } catch (error) {
        console.error("데이터 가져오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [name, tag]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const [searchName, searchTag] = nickName.split("#");
    if (!searchTag) {
      const defaultTag = "KR1";
      navigate(`/users?name=${searchName}&tag=#${defaultTag}`);
      return;
    }
    navigate(`/users?name=${searchName}&tag=${searchTag}`);
    setNickName("");
  };

  return (
    <div className="users-container">
      <div className="nav-link">
        <NavLink to="/champions">챔피언 정보</NavLink>
        <NavLink to="/logout">로그아웃</NavLink>
      </div>

      <div className="users-header">
        <h1 className="header-title">유저 검색</h1>
        <form className="header-form" onSubmit={handleSearch}>
          <input
            type="text"
            value={nickName}
            onChange={(e) => setNickName(e.target.value)}
            placeholder="Hide on bush#KR1"
            maxLength={30}
            className="header-input"
          />
          <button type="submit" className="header-btn">
            검색
          </button>
        </form>
      </div>

      <div className="users-main">
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        ) : (
          <>
            <div className="users-article">
              <div className="article-profile">
                {<Profile name={name} tag={tag} userInfo={userInfo} />}
              </div>
              <div className="article-games">
                {<GameList gameInfos={gameInfos} />}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
