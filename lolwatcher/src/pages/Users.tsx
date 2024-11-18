import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import NavHeader from '../components/common/NavHeader';
import GameList from '../components/users/GameList';
import Profile from '../components/users/Profile';
import axios from 'axios';
import './Users.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
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
  const name = searchParams.get('name') || '카림sk';
  const tag = searchParams.get('tag') || 'KR1';

  const [nickName, setNickName] = useState<string>('');
  const [gameInfos, setGameInfos] = useState<GameInfo[]>([]);
  const [gameReports, setGameReports] = useState<any[]>([]); // reports 상태 추가
  const [userInfo, setUserInfo] = useState<UserInfo[]>([]);
  const [summoner, setSummoner] = useState<Summoner | null>(null);
  const [showAutocomplete, setShowAutocomplete] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [endTime, setEndTime] = useState<number | null>(null);
  const handleRecordButtonClick = async () => {
    try {
      await fetchData(); // fetchData 호출로 모든 데이터를 갱신
    } catch (error) {
      alert('잠시 후 다시 시도해주세요.');
      window.location.reload(); // 페이지 새로고침
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.get(`${API_URL}/riot/info/by-name`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: { name, tag },
      });
      const data = response.data;

      setUserInfo(data.recordDto.userInfo);
      setSummoner(data.recordDto.summoner);

      console.log(data);

      const remainingSeconds = response.data.remainTime;
      setEndTime(Date.now() + remainingSeconds * 1000);
      setIsButtonDisabled(remainingSeconds > 0); // 남은 시간이 있으면 버튼을 비활성화

      const formattedInfos = data.recordDto.matches.map((item: any, index: number) => {
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
          puuid: user.puuid,
        }));
        const mainUser: User | null = users.find((user: User) => user.puuid === data.recordDto.summoner.puuid) || null;

        return {
          id: index + 1,
          gameDuration: item.match.info.gameDuration,
          gameEndStamp: item.match.info.gameEndStamp,
          rank: item.match.info.rank,
          tier: item.match.info.tier,
          division: item.match.info.division,
          winTeam: item.match.info.winTeam,
          users: users,
          mainUser: mainUser,
        };
      });

      setGameInfos(formattedInfos);

      const formattedReports = data.recordDto.matches.map((item: any, index: number) => ({
        id: index + 1, // matches와 동일한 순서를 유지
        ...item.report, // 기존 report 데이터를 모두 포함
      }));

      setGameReports(formattedReports);
    } catch (error) {
      console.error('데이터 가져오기 실패:', error);
      window.alert('닉네임과 태그를 확인해주세요.');
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
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  useEffect(() => {
    fetchData();
  }, [name, tag]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // # 입력 시 자동 완성 표시
    if (inputValue.includes('#')) {
      setShowAutocomplete(true);
    } else {
      setShowAutocomplete(false);
    }

    setNickName(inputValue);
  };

  const handleAutocompleteClick = () => {
    // 자동 완성을 클릭하면 값 설정
    setNickName((prev) => `${prev.split('#')[0]}#KR1`);
    setShowAutocomplete(false); // 자동 완성 닫기
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const [searchName, searchTag] = nickName.split('#');
    if (!searchTag) {
      alert('태그를 입력해주세요!');
      return;
    }
    navigate(`/users?name=${searchName}&tag=${searchTag}`);
  };

  return (
    <div className='users-container'>
      <NavHeader />
      <div className='nav-link'>
        <NavLink to='/logout'>로그아웃</NavLink>
      </div>

      <div className='users-header'>
        <h1 className='header-title'>소환사 검색</h1>
        <form
          className='header-form'
          onSubmit={handleSearch}
        >
          <div className='autocomplete-container'>
            <input
              type='text'
              value={nickName}
              onChange={handleInputChange}
              placeholder='Hide on bush#KR1'
              maxLength={30}
              className='header-input'
            />
            {/* 자동 완성 추천 표시 */}
            {showAutocomplete && (
              <div
                className='autocomplete-item'
                onClick={handleAutocompleteClick}
              >
                {nickName}KR1
              </div>
            )}
          </div>
          <button
            type='submit'
            className='header-btn'
          >
            <FontAwesomeIcon icon={faSearch} /> <b>검색</b>
          </button>
        </form>
      </div>

      <div className='users-main'>
        {loading ? (
          <div className='loading-spinner'>
            <div className='spinner'></div>
          </div>
        ) : (
          <>
            <div className='users-article'>
              <div className='article-profile'>
                <Profile
                  summoner={summoner}
                  userInfo={userInfo}
                  isButtonDisabled={isButtonDisabled}
                  remainingTime={remainingTime}
                  fetchData={fetchData}
                />
              </div>
              <div className='article-games'>
                {
                  <GameList
                    gameInfos={gameInfos}
                    reports={gameReports}
                  />
                }
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
