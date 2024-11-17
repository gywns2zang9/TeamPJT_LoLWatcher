import React from "react";
import "./Profile.css";

import BRONZE from "../../assets/tiers/bronze.png";
import CHALLENGER from "../../assets/tiers/challenger.png";
import DIAMOND from "../../assets/tiers/diamond.png";
import EMERALD from "../../assets/tiers/emerald.png";
import GOLD from "../../assets/tiers/gold.png";
import GRANDMASTER from "../../assets/tiers/grandmaster.png";
import IRON from "../../assets/tiers/iron.png";
import MASTER from "../../assets/tiers/master.png";
import PLATINUM from "../../assets/tiers/platinum.png";
import SILVER from "../../assets/tiers/silver.png";

// 티어별 이미지 매핑
const tierImages: { [key: string]: string } = {
  BRONZE,
  CHALLENGER,
  DIAMOND,
  EMERALD,
  GOLD,
  GRANDMASTER,
  IRON,
  MASTER,
  PLATINUM,
  SILVER
};

interface Summoner {
  profileIcon: number;
  puuid: string;
  summonerLevel: number;
  summonerName: string;
  tag: string;
}

interface UserInfo {
  division: string;
  leaguePoint: number;
  losses: number;
  queueType: string;
  tier: string;
  wins: number;
}

interface ProfileProps {
  summoner: Summoner | null;
  userInfo: UserInfo[];
}

export default function Profile({ summoner, userInfo }: ProfileProps) {
  const getTierImage = (tier: string) => {
    return tierImages[tier] || IRON; // 이미지가 없을 경우 기본으로 IRON 사용
  };

  return (
    <div className="profile-container">
      <div className="profile-info">
        {summoner && (
          <>
            <p className="profile-nickname">
              {summoner.summonerName} <span>#{summoner.tag}</span>
            </p>
          </>
        )}
      </div>
      <div className="rank-info">
        {userInfo.map((info, index) => (
          <div key={index} className="rank-box">
            <p className="rank-title">
              {info.queueType === "RANKED_SOLO_5x5"
                ? "개인/2인 랭크"
                : "자유 랭크"}
            </p>
            <div className="rank-tier">
              <img src={getTierImage(info.tier)} alt="티어png" />
            </div>
            <p className="rank-record">
              {info.tier} {info.division} - {info.leaguePoint}점 ({info.wins}승{" "}
              {info.losses}패)
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
