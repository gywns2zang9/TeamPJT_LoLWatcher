import React, { useEffect, useState } from "react";
import axios from "axios";
import InfoModal from "../components/champions/InfoModal";
import "./Champions.css";

interface Champion {
  id: string;
  name: string;
}

export default function Champions() {
  const CHAMPION_IMG_BASE_URL =
    "https://ddragon.leagueoflegends.com/cdn/14.21.1/img/champion/";

  const [champions, setChampions] = useState<Champion[]>([]);

  const [selectedChampion, setSelectedChampion] = useState<string | null>(null);

  useEffect(() => {
    const fetchChampions = async () => {
      try {
        const response = await axios.get(
          "https://ddragon.leagueoflegends.com/cdn/14.21.1/data/ko_KR/champion.json"
        );
        const data = response.data.data;
        const championsArray = Object.keys(data).map((key) => ({
          id: data[key].id,
          name: data[key].name
        }));

        // 한글 이름 기준으로 정렬
        championsArray.sort((a, b) => a.name.localeCompare(b.name, "ko"));

        setChampions(championsArray);
      } catch (error) {
        console.error("Error fetching champion data:", error);
      }
    };

    fetchChampions();
  }, []);

  const handleChampionClick = (champion: string) => {
    setSelectedChampion(champion);
  };

  const closeModal = () => {
    setSelectedChampion(null);
  };

  return (
    <div className="champions-container">
      <div className="champion-list">
        {champions.map((champion, index) => (
          <div
            key={index}
            className="champion-item"
            onClick={() => handleChampionClick(champion.id)}
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
        <InfoModal championName={selectedChampion} onClose={closeModal} />
      )}
    </div>
  );
}
