import React, { useEffect, useState } from "react";
import axios from "axios";
import NavHeader from "../components/common/NavHeader";
import ChampionDetail from "../components/champions/ChampionDetail";
import "./Champions.css";

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
        console.error(error);
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
