import React, { useState } from "react";
import "./Profile.css";

const CHAMPION_IMG_BASE_URL = process.env.REACT_APP_CHAMPION_IMG_BASE_URL;

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
              <img src={`/tiers/${info.tier}.png`} alt="티어" />
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
