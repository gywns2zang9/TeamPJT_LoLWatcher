import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import NavHeader from "../components/common/NavHeader";
import { functionAccessToken } from "../api/authApi";
import "./Statistics.css";
import StatisticsModal from "../components/statistics/StatisticsModal";

import BRONZE from "../assets/tiers/bronze.png";
import CHALLENGER from "../assets/tiers/challenger.png";
import DIAMOND from "../assets/tiers/diamond.png";
import EMERALD from "../assets/tiers/emerald.png";
import GOLD from "../assets/tiers/gold.png";
import GRANDMASTER from "../assets/tiers/grandmaster.png";
import IRON from "../assets/tiers/iron.png";
import MASTER from "../assets/tiers/master.png";
import PLATINUM from "../assets/tiers/platinum.png";
import SILVER from "../assets/tiers/silver.png";

const API_URL = process.env.REACT_APP_LOLWATCHER_API_URL;
const CHAMPION_IMG_BASE_URL =
  "https://ddragon.leagueoflegends.com/cdn/14.22.1/img/champion/";

// 티어 이미지 맵핑
const tierImages: { [key: string]: string } = {
  iron: IRON,
  bronze: BRONZE,
  silver: SILVER,
  gold: GOLD,
  platinum: PLATINUM,
  emerald: EMERALD,
  diamond: DIAMOND,
  master: MASTER,
  grandmaster: GRANDMASTER,
  challenger: CHALLENGER
};

// 챔피언 정보(Riot 제공)
interface Champion {
  id: string;
  key: string;
  name: string;
}

// 챔피언 통계(LoLWatcher 제공)
interface ChampionStats {
  championId: number; // 챔피언 ID (각 챔피언에 고유한 ID 번호)
  totalGamesPlayed: number; // 해당 티어에서의 총 경기 수
  totalWins: number; // 해당 티어에서의 총 승리 수
  totalBans: number; // 총 밴 횟수
  totalPicks: number; // 총 픽 횟수
  avgKDA: number; // 평균 KDA (킬-데스-어시스트 비율)
  winRate: number; // 승률 (총 승리 수 / 총 경기 수 * 100)
  banRate: number; // 밴률 (밴 횟수 / 총 경기 수 * 100)
  pickRate: number; // 픽률 (픽 횟수 / 총 경기 수 * 100)
  avgDPM: number; // 분당 평균 피해량
  avgTDM: number; // 평균 팀 기여도
  avgGrowth: number; // 평균 성장률
  totalCarnage: number; // 총 학살 횟수
  totalSupport: number; // 총 지원 횟수
  avgClairvoyance: number; // 평균 투시력
  avgDominance: number; // 평균 지배력
  avgSalvation: number; // 평균 구원
  totalEvasion: number; // 총 회피 횟수
}

export default function Statistics() {
  // 티어와 디비전 상태를 관리하는 useState 훅 - 기본값은 "bronze"와 "i"로 설정
  const [tier, setTier] = useState("challenger");
  const [division, setDivision] = useState("i");

  // 챔피언 데이터 및 통계 데이터 상태 관리용 useState 훅들
  const [champions, setChampions] = useState<Champion[]>([]); // 챔피언 데이터 목록
  const [stats, setStats] = useState<ChampionStats[]>([]); // 챔피언 통계 데이터 목록
  const [mergedData, setMergedData] = useState<any[]>([]); // 챔피언과 통계 데이터를 병합한 결과
  const totalGamesPlayed = stats.length > 0 ? stats[0].totalGamesPlayed : null;

  // 정렬 설정 상태 - 정렬할 키와 방향(오름차순/내림차순)을 저장
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  const [selectedChampion, setSelectedChampion] =
    useState<ChampionStats | null>(null); // 선택된 챔피언 저장
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림 상태 관리
  const [searchTerm, setSearchTerm] = useState("");
  const tableRef = useRef<HTMLTableElement>(null);
  // 챔피언 데이터를 가져오는 useEffect 훅 - 컴포넌트가 마운트될 때 실행됨
  useEffect(() => {
    const fetchChampions = async () => {
      try {
        // Riot API에서 챔피언 데이터를 가져옴
        const response = await axios.get(
          "https://ddragon.leagueoflegends.com/cdn/14.22.1/data/ko_KR/champion.json"
        );
        const data = response.data.data;

        // 가져온 데이터를 배열 형태로 변환하여 챔피언 객체 목록 생성
        const championsArray = Object.keys(data).map((key) => ({
          id: data[key].id, // 챔피언 ID
          key: data[key].key, // 챔피언 고유 키
          name: data[key].name // 챔피언 이름
        }));

        // 챔피언 이름을 한글 기준으로 정렬 (이름순)
        championsArray.sort((a, b) => a.name.localeCompare(b.name, "ko"));
        setChampions(championsArray); // 챔피언 데이터 상태 업데이트
      } catch (error) {}
    };

    fetchChampions(); // 챔피언 데이터 요청 함수 호출
  }, []);

  // 챔피언 통계 데이터를 가져오는 useEffect 훅 - 티어와 디비전이 변경될 때마다 실행됨
  useEffect(() => {
    const fetchChampionStats = async () => {
      if (tier) {
        // 티어가 설정된 경우에만 요청 수행
        const accessToken = await functionAccessToken(); // API 호출을 위한 액세스 토큰 가져오기
        try {
          // division이 없는 티어 (master, grandmaster, challenger)일 때와 아닐 때 구분하여 params 설정
          const params = ["master", "grandmaster", "challenger"].includes(tier)
            ? { tier: `${tier}` } // division이 필요 없는 티어일 경우
            : { tier: `${tier}_${division}` }; // division이 필요한 경우

          // 챔피언 통계 데이터를 API에서 가져옴
          const response = await axios.get(`${API_URL}/riot/champion`, {
            params, // 설정된 params를 전송
            headers: { Authorization: `Bearer ${accessToken}` } // 액세스 토큰을 헤더에 추가
          });
          setStats(response.data); // 통계 데이터 상태 업데이트
          console.log(response.data); // 가져온 데이터 콘솔에 출력 (디버깅용)
        } catch (error) {}
      }
    };

    fetchChampionStats(); // 챔피언 통계 데이터 요청 함수 호출
  }, [tier, division]); // 티어 또는 디비전이 변경될 때마다 실행

  // 챔피언 데이터와 통계 데이터를 병합하는 useEffect 훅
  useEffect(() => {
    const merged = champions.map((champion) => {
      // 챔피언의 통계 데이터를 찾아서 챔피언 데이터와 병합
      const stat = stats.find(
        (stat) => stat.championId.toString() === champion.key
      );
      return { ...champion, ...stat }; // 챔피언 데이터와 통계를 병합하여 반환
    });
    setMergedData(merged); // 병합된 데이터를 상태에 저장
  }, [champions, stats]); // 챔피언 또는 통계 데이터가 변경될 때마다 실행

  // 정렬 처리 함수 - 특정 키를 기준으로 데이터를 오름차순 또는 내림차순으로 정렬
  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "desc"; // 기본 정렬 방향을 내림차순(desc)으로 설정
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "desc"
    ) {
      direction = "asc"; // 이미 내림차순인 경우, 오름차순으로 변경
    }
    setSortConfig({ key, direction }); // 새로운 정렬 설정 저장
  };

  // 정렬된 데이터를 memoized 처리하여 리렌더링 최적화
  const sortedData = React.useMemo(() => {
    if (!sortConfig) return mergedData; // 정렬 설정이 없으면 병합 데이터 그대로 반환
    const sorted = [...mergedData].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key])
        return sortConfig.direction === "asc" ? -1 : 1; // 오름차순 정렬
      if (a[sortConfig.key] > b[sortConfig.key])
        return sortConfig.direction === "asc" ? 1 : -1; // 내림차순 정렬
      return 0; // 값이 같은 경우
    });
    return sorted; // 정렬된 데이터 반환
  }, [mergedData, sortConfig]); // 병합 데이터 또는 정렬 설정이 변경될 때마다 실행

  const openModal = (championStats: ChampionStats) => {
    setSelectedChampion(championStats); // 선택된 챔피언 데이터 설정
    setIsModalOpen(true); // 모달 열기
  };

  const closeModal = () => {
    setSelectedChampion(null);
    setIsModalOpen(false);
  };

  const handleSearch = () => {
    if (tableRef.current && searchTerm) {
      // Step 1: 검색어와 일치하는 챔피언 id 찾기
      const champion = champions.find((champ) => champ.name === searchTerm);

      if (champion) {
        // Step 2: 찾은 챔피언 id로 ChampionStats에서 일치하는 championId의 인덱스를 찾기
        const championIndex = sortedData.findIndex(
          (champStats) => champStats.championId.toString() === champion.key
        );

        if (championIndex !== -1) {
          // Step 3: 일치하는 행으로 스크롤
          const row =
            tableRef.current.querySelectorAll("tbody tr")[championIndex];
          row?.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
          alert("해당 챔피언의 통계 데이터가 없습니다.");
        }
      } else {
        alert("검색된 챔피언이 없습니다.");
      }
    }
  };

  return (
    <div className="statistics-container">
      <NavHeader />
      <h1 className="statistics-container-title">LoL Watcher 통계</h1>

      <div className="statistics-header">
        <div className="statistics-header-tier">
          {Object.keys(tierImages).map((tierKey) => (
            <div key={tierKey}>
              <img
                src={tierImages[tierKey]}
                alt={tierKey}
                onClick={() => setTier(tierKey)} // 클릭 시 티어 업데이트
                className={`header-tier-icon ${
                  tier === tierKey ? "selected" : ""
                }`}
              />
            </div>
          ))}
        </div>

        <div className="statistics-header-msg">
          {/* tier가 master, grandmaster, challenger가 아닌 경우에만 division을 표시 */}
          <span>
            {tier.toUpperCase()}{" "}
            {!["master", "grandmaster", "challenger"].includes(tier) &&
              division.toUpperCase()}
            의 {totalGamesPlayed} 게임 자료입니다.
          </span>
        </div>

        <div className="statistics-header-division">
          {["iv", "iii", "ii", "i"].map((divisionKey) => (
            <button
              key={divisionKey}
              onClick={() => setDivision(divisionKey)} // 클릭 시 디비전 업데이트
              className={`header-division-btn ${
                division === divisionKey ? "selected" : ""
              }`}
              disabled={["master", "grandmaster", "challenger"].includes(tier)} // division이 없는 티어일 경우 버튼 비활성화
            >
              {divisionKey.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="챔피언 이름 검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">
          검색
        </button>
      </div>

      {/* 챔피언 통계 테이블 */}
      {sortedData.length > 0 && (
        <table ref={tableRef} className="champions-table">
          <thead>
            <tr>
              <th>#</th>
              <th onClick={() => handleSort("name")}>챔피언 이름</th>
              <th onClick={() => handleSort("pickRate")}>픽률(게임)</th>
              <th onClick={() => handleSort("winRate")}>승률(승리)</th>
              <th onClick={() => handleSort("banRate")}>밴률(밴)</th>
              <th onClick={() => handleSort("avgKDA")}>평균 KDA</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((champion, index) => (
              <tr key={champion.id}>
                <td>#{index + 1}</td>
                <td
                  className="table-champion-info"
                  onClick={() => openModal(champion)} // 클릭 시 모달 열기
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={`${CHAMPION_IMG_BASE_URL}${champion.id}.png`}
                    alt={champion.name}
                    className="table-champion-icon"
                  />
                  <span className="table-champion-name">{champion.name}</span>
                </td>
                <td>
                  {champion.pickRate
                    ? `${champion.pickRate.toFixed(1)}%(${champion.totalPicks})`
                    : "N/A"}
                </td>
                <td>
                  {champion.winRate
                    ? `${champion.winRate.toFixed(1)}%(${champion.totalWins})`
                    : "N/A"}
                </td>
                <td>
                  {champion.banRate
                    ? `${champion.banRate.toFixed(1)}%(${champion.totalBans})`
                    : "N/A"}
                </td>
                <td>{champion.avgKDA ? champion.avgKDA.toFixed(2) : "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* 선택된 챔피언 정보를 모달로 표시 */}
      {isModalOpen && selectedChampion && (
        <div className="statistics-modal-backdrop" onClick={closeModal}>
          <div
            className={`statistics-modal-content ${isModalOpen ? "open" : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            <StatisticsModal
              isOpen={isModalOpen}
              onClose={closeModal}
              championStats={selectedChampion}
              championName={
                champions.find((champ) => champ.key === selectedChampion?.championId.toString())?.name
              }
              championImgUrl={
                champions.find((champ) => champ.key === selectedChampion?.championId.toString())?.id
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
