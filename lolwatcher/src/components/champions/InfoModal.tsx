import React, { useEffect, useState } from "react";
import axios from "axios";
import "./InfoModal.css";

interface InfoModalProps {
  championId: string;
  championKey: string;
  championName: string;
  championTitle: string;
  championBlurb: string;
  onClose: () => void;
}

interface Spell {
  id: string;
  name: string;
  description: string;
}

export default function InfoModal({
  championId,
  championKey,
  championName,
  championTitle,
  championBlurb,
  onClose
}: InfoModalProps) {
  const CHAMPION_BACKGROUND_IMG_BASE_URL =
    "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/"; // centered or splash or loading
  const PASSIVE_IMG_BASE_URL =
    "https://ddragon.leagueoflegends.com/cdn/14.21.1/img/passive/"; //Passive
  const SPELL_IMG_BASE_URL =
    "https://ddragon.leagueoflegends.com/cdn/14.21.1/img/spell/"; //Skills

  const [spells, setSpells] = useState<Spell[]>([]);
  const [passiveImageUrl, setPassiveImageUrl] = useState<string | null>(null);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchChampionData = async () => {
      try {
        const url = `https://ddragon.leagueoflegends.com/cdn/14.21.1/data/ko_KR/champion/${championId}.json`;
        const response = await axios.get(url);
        const championData = response.data.data[championId];
        const spellsData = championData.spells.map((spell: any) => ({
          id: spell.id,
          name: spell.name,
          description: spell.description
        }));
        setSpells(spellsData);

        setPassiveImageUrl(
          `${PASSIVE_IMG_BASE_URL}${championData.passive.image.full}`
        ); // 패시브 스킬 비디오 URL 초기 설정
        const paddedChampionKey = championKey.padStart(4, "0");
        const initialVideoUrl = `https://d28xe8vt774jo5.cloudfront.net/champion-abilities/${paddedChampionKey}/ability_${paddedChampionKey}_P1.webm`;
        setSelectedVideoUrl(initialVideoUrl);
      } catch (error) {
        console.error(error);
      }
    };

    fetchChampionData();
  }, [championId, championKey]);

  // 클릭 시 비디오 URL 설정
  const handleImageClick = (spellType: string) => {
    // championKey를 4자리로 패딩
    const paddedChampionKey = championKey.padStart(4, "0");

    const videoUrl = `https://d28xe8vt774jo5.cloudfront.net/champion-abilities/${paddedChampionKey}/ability_${paddedChampionKey}_${spellType}1.webm`;
    console.log(videoUrl);
    setSelectedVideoUrl(videoUrl);
  };

  return (
    <div
      className="info-container"
      style={{
        backgroundImage: `url(${CHAMPION_BACKGROUND_IMG_BASE_URL}${championId}_0.jpg)`
      }}
    >
      <div className="info-content">
        <h2>{championName}</h2>
        <h3>{championTitle}</h3>
        <p>{championBlurb}</p>

        <div className="spells-container">
          {/* Passive 스킬 */}
          {passiveImageUrl && (
            <div className="spell-item" onClick={() => handleImageClick("P")}>
              <img src={passiveImageUrl} alt="Passive" />
            </div>
          )}
          {/* Q, W, E, R 스킬 */}
          {spells.map((spell, index) => {
            const spellType = ["Q", "W", "E", "R"][index];
            return (
              <div
                key={spell.id}
                className="spell-item"
                onClick={() => handleImageClick(spellType)}
              >
                <img
                  src={`${SPELL_IMG_BASE_URL}${spell.id}.png`}
                  alt={spell.name}
                />
                {/* <h4>{spell.name}</h4> */}
                {/* <p>{spell.description}</p> */}{" "}
              </div>
            );
          })}
        </div>

        {/* 비디오 모달 */}
        {selectedVideoUrl && (
          <div className="video-modal">
            <div className="video-content">
              <video
                src={selectedVideoUrl}
                autoPlay
                controls
                className="spell-video"
              />
            </div>
          </div>
        )}
        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  );
}
