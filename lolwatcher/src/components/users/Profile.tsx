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
          {name}#{tag}
        </h2>
        <div>
          {userInfo.map((info, index) => (
            <div key={index}>
              <p>Queue Type: {info.queueType}</p>
              <p>
                Tier: {info.tier} {info.division}
              </p>
              <img
                className="profile-tier"
                src={`/tiers/Rank=${info.tier}.png`}
                alt="티어"
              />
              <p>League Points: {info.leaguePoint}</p>
              <p>Wins: {info.wins}</p>
              <p>Losses: {info.losses}</p>
            </div>
          ))}
        </div>
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
    </div>
  );
}
