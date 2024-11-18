import React, { useState, useEffect } from "react";
import axios from "axios";
import NavHeader from "../components/common/NavHeader";
import { functionAccessToken } from "../api/authApi";
import "./Statistics.css";

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

// 챔피언 정보 인터페이스
interface Champion {
  id: string;
  key: string;
  name: string;
}

// 챔피언 통계 인터페이스
interface ChampionStats {
  championId: number;
  totalGamesPlayed: number;
  totalWins: number;
  winRate: number;
  avgKDA: number;
  pickRate: number;
  banRate: number;
}

export default function Statistics() {
  const [tier, setTier] = useState("bronze");
  const [division, setDivision] = useState("i");
  const [champions, setChampions] = useState<Champion[]>([]);
  const [stats, setStats] = useState<ChampionStats[]>([]);
  const [mergedData, setMergedData] = useState<any[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  // 챔피언 데이터 가져오기
  useEffect(() => {
    const fetchChampions = async () => {
      try {
        const response = await axios.get(
          "https://ddragon.leagueoflegends.com/cdn/14.22.1/data/ko_KR/champion.json"
        );
        const data = response.data.data;
        const championsArray = Object.keys(data).map((key) => ({
          id: data[key].id,
          key: data[key].key,
          name: data[key].name
        }));

        championsArray.sort((a, b) => a.name.localeCompare(b.name, "ko"));
        setChampions(championsArray);
      } catch (error) {
        console.error("챔피언 데이터 요청 실패:", error);
      }
    };

    fetchChampions();
  }, []);

  // 챔피언 통계 데이터 가져오기
  useEffect(() => {
    const fetchChampionStats = async () => {
      if (tier && division) {
        const accessToken = await functionAccessToken();
        try {
          const response = await axios.get(`${API_URL}/riot/champion`, {
            params: { tier: `${tier}_${division}` },
            headers: { Authorization: `Bearer ${accessToken}` }
          });
          setStats(response.data);
        } catch (error) {
          console.error("데이터 요청 실패:", error);
        }
      }
    };

    fetchChampionStats();
  }, [tier, division]);

  // 챔피언 데이터와 통계 데이터 병합
  useEffect(() => {
    const merged = champions.map((champion) => {
      const stat = stats.find(
        (stat) => stat.championId.toString() === champion.key
      );
      return { ...champion, ...stat };
    });
    setMergedData(merged);
  }, [champions, stats]);

  // 정렬 처리
  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
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

  return (
    <div className="statistics-container">
      <NavHeader />
      <h1>통계</h1>

      {/* 티어 선택 */}
      <div className="tier-selection">
        {Object.keys(tierImages).map((tierKey) => (
          <img
            key={tierKey}
            src={tierImages[tierKey]}
            alt={tierKey}
            onClick={() => setTier(tierKey)}
            className={`tier-icon ${tier === tierKey ? "selected" : ""}`}
          />
        ))}
      </div>

      {/* 디비전 선택 */}
      <div className="division-selection">
        {["i", "ii", "iii", "iv"].map((divisionKey) => (
          <button
            key={divisionKey}
            onClick={() => setDivision(divisionKey)}
            className={`division-button ${
              division === divisionKey ? "selected" : ""
            }`}
          >
            {divisionKey.toUpperCase()}
          </button>
        ))}
      </div>

      {/* 챔피언 통계 테이블 */}
      {sortedData.length > 0 && (
        <table className="champions-table">
          <thead>
            <tr>
              <th onClick={() => handleSort("name")}>챔피언 이름</th>
              <th onClick={() => handleSort("totalGamesPlayed")}>총 경기수</th>
              <th onClick={() => handleSort("totalWins")}>총 승리수</th>
              <th onClick={() => handleSort("winRate")}>승률</th>
              <th onClick={() => handleSort("avgKDA")}>평균 KDA</th>
              <th onClick={() => handleSort("pickRate")}>픽률</th>
              <th onClick={() => handleSort("banRate")}>밴률</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((champion) => (
              <tr key={champion.id}>
                <td>
                  <img
                    src={`${CHAMPION_IMG_BASE_URL}${champion.id}.png`}
                    alt={champion.name}
                    className="champion-icon"
                  />
                  {champion.name}
                </td>
                <td>{champion.totalGamesPlayed || "N/A"}</td>
                <td>{champion.totalWins || "N/A"}</td>
                <td>
                  {champion.winRate ? `${champion.winRate.toFixed(1)}%` : "N/A"}
                </td>
                <td>{champion.avgKDA ? champion.avgKDA.toFixed(2) : "N/A"}</td>
                <td>
                  {champion.pickRate
                    ? `${champion.pickRate.toFixed(1)}%`
                    : "N/A"}
                </td>
                <td>
                  {champion.banRate ? `${champion.banRate.toFixed(1)}%` : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
