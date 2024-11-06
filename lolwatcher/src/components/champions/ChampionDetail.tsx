import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ChampionDetail.css";
import XmarkIcon from "../common/XmarkIcon";
import EyeSlashIcon from "../common/EyeSlashIcon";

interface ChampionDetaillProps {
  championId: string; //"Garen"
  championKey: string; //"86"
  championName: string; //"가렌"
  onClose: () => void;
}

interface ChampionData {
  title: string; //"데마시아의 힘"
  lore: string; //"가렌은 불굴의 선봉대를 이끄는..."
}

interface Spell {
  id: string; //GarenQ
  name: string; //"결정타"
  description: string; //"가렌의 이동 속도가 큰 폭으로 증가하고..."
}

interface Skin {
  id: string;
  num: number;
  name: string;
}

export default function ChampionDetail({
  championId,
  championKey,
  championName,
  onClose
}: ChampionDetaillProps) {
  const CHAMPION_BACKGROUND_IMG_BASE_URL =
    "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/"; // centered or splash or loading
  const PASSIVE_IMG_BASE_URL =
    "https://ddragon.leagueoflegends.com/cdn/14.21.1/img/passive/"; //Passive
  const SPELL_IMG_BASE_URL =
    "https://ddragon.leagueoflegends.com/cdn/14.21.1/img/spell/"; //Skills

  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(true);
  const [champion, setChampion] = useState<ChampionData | null>(null);
  const [selectedTitle, setSelectedTitle] = useState<string>("");
  const [selectedDescription, setSelectedDescription] = useState<string>("");
  const [passiveImageUrl, setPassiveImageUrl] = useState<string | null>(null);
  const [spells, setSpells] = useState<Spell[]>([]);
  const [selectedSpellType, setSelectedSpellType] = useState<string | null>(
    null
  );
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);
  const [skins, setSkins] = useState<Skin[]>([]);
  const [selectedSkinIndex, setSelectedSkinIndex] = useState<number>(0);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [championId, championKey]);

  useEffect(() => {
    const fetchChampionData = async () => {
      try {
        const url = `https://ddragon.leagueoflegends.com/cdn/14.21.1/data/ko_KR/champion/${championId}.json`;
        const response = await axios.get(url);
        const championData = response.data.data[championId];
        setChampion({ title: championData.title, lore: championData.lore });
        setSelectedTitle(championData.title);
        setSelectedDescription(championData.lore);

        const passiveData = {
          id: "passive",
          name: championData.passive.name,
          description: championData.passive.description
        };
        setPassiveImageUrl(
          `${PASSIVE_IMG_BASE_URL}${championData.passive.image.full}`
        );
        const spellsData = championData.spells.map((spell: any) => ({
          id: spell.id,
          name: spell.name,
          description: spell.description
        }));
        setSpells([passiveData, ...spellsData]);

        setSelectedSpellType(null);
        setSelectedVideoUrl(null);
      } catch (error) {
        console.error(error);
      }
    };

    fetchChampionData();
  }, [championId]);

  useEffect(() => {
    const fetchSkinData = async () => {
      try {
        const url = `https://ddragon.leagueoflegends.com/cdn/14.21.1/data/ko_KR/champion/${championId}.json`;
        const response = await axios.get(url);
        const championData = response.data.data[championId];

        const skinsData = championData.skins.map((skin: any) => ({
          id: skin.id,
          num: skin.num,
          name: skin.name === "default" ? championName : skin.name
        }));
        setSkins(skinsData);
        setSelectedSkinIndex(0);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSkinData();
  }, [championId, championName]);

  useEffect(() => {
    setShowContent(true);
  }, [championId]);

  const toggleShow = () => {
    setShowContent((prev) => !prev);
  };

  const handleNameClick = () => {
    if (champion) {
      setSelectedTitle(champion.title);
      setSelectedDescription(champion.lore);
      setSelectedSpellType(null);
      setSelectedVideoUrl(null);
    }
  };

  const handleImageClick = (
    spellType: string,
    spellName: string,
    spellDescription: string
  ) => {
    const paddedChampionKey = championKey.padStart(4, "0");
    const videoUrl = `https://d28xe8vt774jo5.cloudfront.net/champion-abilities/${paddedChampionKey}/ability_${paddedChampionKey}_${spellType}1.webm`;
    setSelectedVideoUrl(videoUrl);
    setSelectedSpellType(spellType);
    setSelectedTitle(`${spellType} - ${spellName}`);
    setSelectedDescription(spellDescription);
  };

  const handleSkinChange = (event: React.MouseEvent, index: number) => {
    event.stopPropagation();
    setLoading(true);
    setTimeout(() => {
      setSelectedSkinIndex(index);
      setLoading(false);
    }, 200);
  };

  const selectedSkin = skins[selectedSkinIndex];

  if (loading) {
    return (
      <div className="info-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="info-container"
      onClick={() => !showContent && toggleShow()}
      style={{
        backgroundImage: `url(${CHAMPION_BACKGROUND_IMG_BASE_URL}${championId}_${selectedSkin?.num}.jpg)`
      }}
    >
      {showContent && (
        <button className="eye-btn" onClick={toggleShow}>
          <EyeSlashIcon />
        </button>
      )}
      <button className="close-btn" onClick={onClose}>
        <XmarkIcon />
      </button>
      {showContent && (
        <div className="info-content">
          <h2 className="info-name" onClick={handleNameClick}>
            {/* {championName} */}
            {selectedSkin?.name || championName}
          </h2>
          <h3 className="info-title">{selectedTitle}</h3>
          <div className="spells-container">
            {/* Passive 스킬 */}
            {passiveImageUrl && (
              <div
                className={`spell-item ${
                  selectedSpellType === "P" ? "selected-spell" : ""
                }`}
                onClick={() =>
                  handleImageClick("P", spells[0].name, spells[0].description)
                }
              >
                <img src={passiveImageUrl} alt="Passive" />
              </div>
            )}
            {/* Q, W, E, R 스킬 */}
            {spells.slice(1).map((spell, index) => {
              const spellType = ["Q", "W", "E", "R"][index];
              return (
                <div
                  key={spell.id}
                  className={`spell-item ${
                    selectedSpellType === spellType ? "selected-spell" : ""
                  }`}
                  onClick={() =>
                    handleImageClick(spellType, spell.name, spell.description)
                  }
                >
                  <img
                    src={`${SPELL_IMG_BASE_URL}${spell.id}.png`}
                    alt={spell.name}
                  />
                </div>
              );
            })}
          </div>
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
          <p
            className="item-description"
            dangerouslySetInnerHTML={{ __html: selectedDescription }}
          ></p>
        </div>
      )}
      {/* Skin Selector Dots */}
      <div className="skin-selector">
        {skins.map((skin, index) => (
          <span
            key={index}
            className={`skin-dot ${
              selectedSkinIndex === index ? "active" : ""
            }`}
            onClick={(event) => handleSkinChange(event, index)}
          ></span>
        ))}
      </div>
    </div>
  );
}
