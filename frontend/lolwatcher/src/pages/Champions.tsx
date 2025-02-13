import React, { useEffect, useState } from "react";
import axios from "axios";
import NavHeader from "../components/common/NavHeader";
import ChampionDetail from "../components/champions/ChampionDetail";
import "./Champions.css";
import { functionAccessToken } from "../api/authApi";

interface Champion {
  id: string;
  key: string;
  name: string;
}

export default function Champions() {
  const CHAMPION_IMG_BASE_URL =
    "https://ddragon.leagueoflegends.com/cdn/14.22.1/img/champion/";

  const [champions, setChampions] = useState<Champion[]>([]);
  const [selectedChampion, setSelectedChampion] = useState<Champion | null>(
    null
  );

  useEffect(() => {
    const checkAccessToken = async () => {
      try {
        const hasAccessToken = await functionAccessToken(); // AccessToken 확인 함수 호출
        if (!hasAccessToken) {
          alert("로그인이 필요합니다.");
          window.location.href = "/"; // AccessToken이 없으면 로그인 페이지로 이동
        }
      } catch (error) {
        alert("로그인이 필요합니다.");
        window.location.href = "/"; // 오류가 발생해도 안전하게 이동
      }
    };

    checkAccessToken(); // 컴포넌트 마운트 시 실행
  }, []);

  useEffect(() => {
    const fetchChampions = async () => {
      try {
        const response = await axios.get(
          "https://ddragon.leagueoflegends.com/cdn/14.22.1/data/ko_KR/champion.json"
        );
        const data = response.data.data;
        const championsArray = Object.keys(data).map((key) => ({
          id: data[key].id, //"Aatrox"
          key: data[key].key, //"266"
          name: data[key].name //"아트록스"
        }));
        // 한글 이름 기준으로 정렬
        championsArray.sort((a, b) => a.name.localeCompare(b.name, "ko"));
        setChampions(championsArray);
      } catch (error) {
        // console.error(error);
      }
    };

    fetchChampions();
  }, []);

  const handleChampionClick = (champion: Champion) => {
    if (selectedChampion?.id === champion.id) {
      setSelectedChampion(null);
    } else {
      setSelectedChampion(champion);
    }
  };

  const handleClose = () => {
    setSelectedChampion(null);
  };

  const openSurvey = () => {
    window.open("https://forms.gle/vffXABi4fY7SFKbZ6", "_blank");
  };

  return (
    <div className="champions-container">
      <NavHeader />

      <div className="champion-list">
        {champions.map((champion, index) => (
          <div
            key={index}
            className={`champion-item ${
              selectedChampion?.id === champion.id ? "selected" : ""
            }`}
            onClick={() => handleChampionClick(champion)}
          >
            <img
              src={`${CHAMPION_IMG_BASE_URL}${champion.id}.png`}
              alt={champion.name}
            />
            <p>{champion.name}</p>
          </div>
        ))}
      </div>
      {selectedChampion && (
        <div className="champion-details">
          <ChampionDetail
            championId={selectedChampion.id}
            championName={selectedChampion.name}
            championKey={selectedChampion.key}
            onClose={handleClose}
          />
        </div>
      )}
    </div>
  );
}
