import React, { useEffect, useState } from "react";
import axios from "axios";
import "./InfoModal.css";

interface InfoModalProps {
  championName: string;
  onClose: () => void;
}

interface Spell {
  id: string;
  name: string;
  description: string;
}

export default function InfoModal({ championName, onClose }: InfoModalProps) {
  const CHAMPION_BACKGROUND_IMG_BASE_URL =
    "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/"; // centered or splash or loading
  const CHAMPION_DATA_URL = `https://ddragon.leagueoflegends.com/cdn/14.21.1/data/en_US/champion/${championName}.json`;
  const PASSIVE_IMG_BASE_URL =
    "https://ddragon.leagueoflegends.com/cdn/14.21.1/img/passive/"; //Passive
  const SPELL_IMG_BASE_URL =
    "https://ddragon.leagueoflegends.com/cdn/14.21.1/img/spell/"; //Skills

  const [spells, setSpells] = useState<Spell[]>([]);
  const [passiveImageUrl, setPassiveImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchChampionData = async () => {
      try {
        const response = await axios.get(CHAMPION_DATA_URL);
        const championData = response.data.data[championName];
        const spellsData = championData.spells.map((spell: any) => ({
          id: spell.id,
          name: spell.name,
          description: spell.description
        }));
        setSpells(spellsData);

        setPassiveImageUrl(
          `${PASSIVE_IMG_BASE_URL}${championData.passive.image.full}`
        );
      } catch (error) {
        console.error("Error fetching champion data:", error);
      }
    };

    fetchChampionData();
  }, [championName]);

  return (
    <div
      className="info-container"
      style={{
        backgroundImage: `url(${CHAMPION_BACKGROUND_IMG_BASE_URL}${championName}_0.jpg)`
      }}
    >
      <div className="info-content">
        <h2>{championName}</h2>
        <p>챔피언에 대한 추가 정보를 여기에 표시합니다.</p>

        <div className="spells-container">
          {passiveImageUrl && (
            <div className="spell-item">
              <img src={passiveImageUrl} alt="Passive" />
            </div>
          )}
          {spells.map((spell) => (
            <div key={spell.id} className="spell-item">
              <img
                src={`${SPELL_IMG_BASE_URL}${spell.id}.png`}
                alt={spell.name}
              />
              {/* <h4>{spell.name}</h4> */}
              {/* <p>{spell.description}</p> */}
            </div>
          ))}
        </div>

        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  );
}
