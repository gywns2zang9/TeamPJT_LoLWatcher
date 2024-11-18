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

interface Champion {
  id: string;
  key: string;
  name: string;
}

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
  const [tier, setTier] = useState("challenger");
  const [division, setDivision] = useState("i");
  const [champions, setChampions] = useState<Champion[]>([]);
  const [stats, setStats] = useState<ChampionStats[]>([]);
  const [mergedData, setMergedData] = useState<any[]>([]);
  const totalGamesPlayed = stats.length > 0 ? stats[0].totalGamesPlayed : null;
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [selectedChampion, setSelectedChampion] =
    useState<ChampionStats | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const tableRef = useRef<HTMLTableElement>(null);
  const [searchedChampionIndex, setSearchedChampionIndex] = useState<
    number | null
  >(null);

  useEffect(() => {
    const fetchChampions = async () => {
      try {
        const response = await axios.get(
          "https://ddragon.leagueoflegends.com/cdn/14.22.1/data/ko_KR/champion.json"
        );
        const data = response.data.data;
        const championsArray = Object.keys(data).map((key) => ({
          id: data[key].id, // 챔피언 ID
          key: data[key].key, // 챔피언 고유 키
          name: data[key].name // 챔피언 이름
        }));
        championsArray.sort((a, b) => a.name.localeCompare(b.name, "ko"));
        setChampions(championsArray);
      } catch (error) {}
    };
    fetchChampions();
  }, []);

  useEffect(() => {
    const fetchChampionStats = async () => {
      if (tier) {
        const accessToken = await functionAccessToken();
        try {
          const params = ["master", "grandmaster", "challenger"].includes(tier)
            ? { tier: `${tier}` }
            : { tier: `${tier}_${division}` };

          const response = await axios.get(`${API_URL}/riot/champion`, {
            params,
            headers: { Authorization: `Bearer ${accessToken}` }
          });
          setStats(response.data);
        } catch (error) {}
      }
    };
    fetchChampionStats();
  }, [tier, division]);

  useEffect(() => {
    const merged = champions.map((champion) => {
      const stat = stats.find(
        (stat) => stat.championId.toString() === champion.key
      );
      return { ...champion, ...stat };
    });
    setMergedData(merged);
  }, [champions, stats]);

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "desc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "desc"
    ) {
      direction = "asc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    if (!sortConfig) return mergedData;
    const sorted = [...mergedData].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key])
        return sortConfig.direction === "asc" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key])
        return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [mergedData, sortConfig]);

  const openModal = (championStats: ChampionStats) => {
    setSelectedChampion(championStats);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedChampion(null);
    setIsModalOpen(false);
  };

  const handleSearch = () => {
    if (tableRef.current && searchTerm) {
      const champion = champions.find((champ) => champ.name === searchTerm);
      if (champion) {
        const championKey = Number(champion.key);
        const championIndex = sortedData.findIndex(
          (champ) => champ.championId === championKey
        );

        if (championIndex !== -1) {
          setSearchedChampionIndex(championIndex);
          const row =
            tableRef.current.querySelectorAll("tbody tr")[championIndex];
          row?.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
          setSearchedChampionIndex(null);
        }
      } else {
        setSearchedChampionIndex(null);
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    setSearchedChampionIndex(null);
    if (tableRef.current) {
      tableRef.current.scrollTop = 0;
    }
  }, [tier, division]);

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
                onClick={() => setTier(tierKey)}
                className={`header-tier-icon ${
                  tier === tierKey ? "selected" : ""
                }`}
              />
            </div>
          ))}
        </div>

        <div className="statistics-header-msg">
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
              onClick={() => setDivision(divisionKey)}
              className={`header-division-btn ${
                division === divisionKey ? "selected" : ""
              }`}
              disabled={["master", "grandmaster", "challenger"].includes(tier)}
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
          onKeyDown={handleKeyDown}
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">
          검색
        </button>
      </div>

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
              <tr
                key={champion.id}
                className={
                  index === searchedChampionIndex ? "highlighted-row" : ""
                }
              >
                <td>#{index + 1}</td>
                <td
                  className="table-champion-info"
                  onClick={() => openModal(champion)}
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
            />
          </div>
        </div>
      )}
    </div>
  );
}
