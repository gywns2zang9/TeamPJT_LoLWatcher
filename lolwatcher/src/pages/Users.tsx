import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { functionAccessToken } from "../api/authApi";
import NavHeader from "../components/common/NavHeader";
import GameList from "../components/users/GameList";
import Profile from "../components/users/Profile";
import axios from "axios";
import "./Users.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
const API_URL = process.env.REACT_APP_LOLWATCHER_API_URL;
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

interface UserInfo {
  division: string;
  leaguePoint: number;
  losses: number;
  queueType: string;
  tier: string;
  wins: number;
}

interface Summoner {
  profileIcon: number;
  puuid: string;
  summonerLevel: number;
  summonerName: string;
  tag: string;
}

export default function Users() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  // URL의 params에서 name과 tag를 가져오거나 기본값을 설정
  const name = searchParams.get("name") || "bUlldOg";
  const tag = searchParams.get("tag") || "KR3";
  const puuid = searchParams.get("puuid") || "";

  const [nickName, setNickName] = useState<string>("");
  const [gameInfos, setGameInfos] = useState<GameInfo[]>([]);
  const [gameReports, setGameReports] = useState<any[]>([]); // reports 상태 추가
  const [userInfo, setUserInfo] = useState<UserInfo[]>([]);
  const [summoner, setSummoner] = useState<Summoner | null>(null);
  const [showAutocomplete, setShowAutocomplete] = useState<boolean>(false);
  const [highlighted, setHighlighted] = useState<boolean>(false); // 추천 항목 하이라이트 상태 추가
  const [loading, setLoading] = useState(true);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [endTime, setEndTime] = useState<number | null>(null);
  const handleRecordButtonClick = async () => {
    try {
      await fetchData(); // fetchData 호출로 모든 데이터를 갱신
    } catch (error) {
      alert("잠시 후 다시 시도해주세요.");
      window.location.reload(); // 페이지 새로고침
    }
  };
  const fetchData = async () => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        throw new Error("AccessToken is missing."); // AccessToken이 없으면 에러 발생
      }

      let response;

      if (puuid) {
        // puuid가 있을 경우 /riot/info/by-puuid로 요청
        response = await axios.get(`${API_URL}/riot/info/by-puuid`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
          params: { puuid }
        });
      } else {
        // puuid가 없으면 /riot/info/by-name으로 요청
        response = await axios.get(`${API_URL}/riot/info/by-name`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
          params: { name, tag }
        });
      }

      const data = response.data;

      setUserInfo(data.recordDto.userInfo);
      setSummoner(data.recordDto.summoner);

      console.log(data);

      const remainingSeconds = response.data.remainTime;
      setEndTime(Date.now() + remainingSeconds * 1000);
      setIsButtonDisabled(remainingSeconds > 0);

      const formattedInfos = data.recordDto.matches.map(
        (item: any, index: number) => {
          const users = item.match.users.map((user: any) => ({
            championName: user.championName,
            summonerName: user.summonerName,
            teamId: user.teamId,
            kills: user.kills,
            assists: user.assists,
            deaths: user.deaths,
            totalMinionsKilled: user.totalMinionsKilled,
            tier: user.tier,
            division: user.division,
            puuid: user.puuid
          }));
          const mainUser: User | null =
            users.find(
              (user: User) => user.puuid === data.recordDto.summoner.puuid
            ) || null;

          return {
            id: index + 1,
            gameDuration: item.match.info.gameDuration,
            gameEndStamp: item.match.info.gameEndStamp,
            rank: item.match.info.rank,
            tier: item.match.info.tier,
            division: item.match.info.division,
            winTeam: item.match.info.winTeam,
            users: users,
            mainUser: mainUser
          };
        }
      );

      setGameInfos(formattedInfos);

      const formattedReports = data.recordDto.matches.map(
        (item: any, index: number) => ({
          id: index + 1,
          ...item.report
        })
      );

      setGameReports(formattedReports);
    } catch (error: any) {
      if (error.message === "AccessToken is missing.") {
        alert("로그인이 필요합니다.");
        navigate("/");
      } else {
        window.alert("소환사의 닉네임과 태그를 확인해주세요.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (endTime) {
      const updateRemainingTime = () => {
        const timeLeft = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
        setRemainingTime(timeLeft);

        if (timeLeft > 0) {
          requestAnimationFrame(updateRemainingTime);
        } else {
          setIsButtonDisabled(false);
          setRemainingTime(null);
        }
      };

      updateRemainingTime();
    }
  }, [endTime]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  useEffect(() => {
    fetchData();
  }, [name, tag]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // # 뒤에 입력된 값을 확인
    const [baseName, tagPart] = inputValue.split("#");

    if (tagPart === undefined) {
      // #가 입력되지 않은 경우 추천 창 숨김
      setShowAutocomplete(false);
    } else if (tagPart === "" || ["K", "KR", "KR1"].includes(tagPart)) {
      // #만 입력되었거나 # 뒤에 K, KR, KR1 중 하나일 경우 추천 창 표시
      setShowAutocomplete(true);
    } else {
      // # 뒤에 허용되지 않은 문자가 있으면 추천 창 숨김
      setShowAutocomplete(false);
    }

    setNickName(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (showAutocomplete && e.key === "ArrowDown") {
      e.preventDefault(); // 기본 동작 방지
      setHighlighted(true); // 추천 항목 하이라이트
    }
    if (highlighted && e.key === "Enter") {
      e.preventDefault(); // 기본 동작 방지
      setNickName((prev) => `${prev.split("#")[0]}#KR1`); // 자동 완성 적용
      setShowAutocomplete(false); // 추천 창 닫기
      setHighlighted(false); // 하이라이트 초기화
    }
  };

  // 자동 완성 클릭 처리
  const handleAutocompleteClick = () => {
    setNickName((prev) => `${prev.split("#")[0]}#KR1`);
    setShowAutocomplete(false);
    setHighlighted(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const [searchName, searchTag] = nickName.split("#");
    if (!searchTag) {
      alert("태그를 입력해주세요!");
      return;
    }
    navigate(`/users?name=${searchName}&tag=${searchTag}`);
  };

  return (
    <div className="users-container">
      <div className="users-header">
        <NavHeader />
        <p className="header-title">소환사 검색</p>
        <form className="header-form" onSubmit={handleSearch}>
          <div className="autocomplete-container">
            <input
              type="text"
              value={nickName}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Hide on bush#KR1"
              maxLength={30}
              className="header-input"
            />
            {/* 자동 완성 추천 표시 */}
            {showAutocomplete && (
              <div
                className={`autocomplete-item ${
                  highlighted ? "highlighted" : ""
                }`} // 하이라이트 클래스 추가
                onClick={handleAutocompleteClick}
              >
                {nickName.split("#")[0]}#KR1 {/* 항상 #KR1 고정 */}
              </div>
            )}
          </div>
          <button type="submit" className="header-btn">
            <FontAwesomeIcon icon={faSearch} /> <b>검색</b>
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
                <Profile
                  summoner={summoner}
                  userInfo={userInfo}
                  isButtonDisabled={isButtonDisabled}
                  remainingTime={remainingTime}
                  fetchData={fetchData}
                />
              </div>
              <div className="article-games">
                {<GameList gameInfos={gameInfos} reports={gameReports} />}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
