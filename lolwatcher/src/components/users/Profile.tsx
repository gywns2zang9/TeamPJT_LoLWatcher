import React, { useState } from "react";
import { getUserProfile } from "../../api/gameApi";
import "./Profile.css";

const CHAMPION_IMG_BASE_URL = process.env.REACT_APP_CHAMPION_IMG_BASE_URL;

interface UserInfo {
  division: string;
  leaguePoint: number;
  losses: number;
  queueType: string;
  tier: string;
  wins: number;
}

interface ProfileProps {
  name: string; //카림sk
  tag: string; //kr1
  userInfo: UserInfo[];
}

export default function Profile({ name, tag, userInfo }: ProfileProps) {
  return (
    <div className="profile-container">
      <div className="profile-info">
        <h2 className="profile-nickname">
          {name}#{tag} {"  "}
          <button>새로고침</button>
        </h2>
        {/* <div className="profile-most3">
          <img
            src={`${CHAMPION_IMG_BASE_URL}${profile.most1}.png`}
            alt="모스트1"
          />
          <img
            src={`${CHAMPION_IMG_BASE_URL}${profile.most2}.png`}
            alt="모스트2"
          />
          <img
            src={`${CHAMPION_IMG_BASE_URL}${profile.most3}.png`}
            alt="모스트3"
          />
        </div> */}
      </div>

      <div className="rank-info">
        {userInfo.map((info, index) => (
          <div key={index} className="rank-box">
            <h3>
              {info.queueType === "RANKED_SOLO_5x5"
                ? "개인/2인 랭크"
                : "자유 랭크"}
            </h3>
            <img
              className="rank-tier"
              src={`/tiers/Rank=${info.tier}.png`}
              alt="티어"
            />
            <h3>
              {info.tier} {info.division} - {info.leaguePoint}점 ({info.wins}승{" "}
              {info.losses}패)
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}
