import React, { useEffect, useState } from "react";
import { getUserProfile } from "../../api/gameApi";
import "./Profile.css";

const CHAMPION_IMG_BASE_URL =
  "https://ddragon.leagueoflegends.com/cdn/14.22.1/img/champion/";

interface UserProfile {
  nickname: string;
  tier: string;
  most1: string;
  most2: string;
  most3: string;
}

interface ProfileProps {
  name: string; //카림sk
  tag: string; //kr1
}

export default function Profile({ name, tag }: ProfileProps) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const defaultProfile: UserProfile = {
    nickname: `${name}#${tag}`,
    tier: "Grandmaster",
    most1: "Leblanc",
    most2: "Tristana",
    most3: "Lucian"
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const responseData = await getUserProfile(); // name과 tag를 함수에 전달
        setUserProfile(responseData);
      } catch (error) {
        setUserProfile(defaultProfile);
      }
    };

    fetchUserProfile();
  }, [name, tag]); // name과 tag를 종속성 배열에 추가

  const profile = userProfile || defaultProfile;

  return (
    <div className="profile-container">
      <img
        className="profile-tier"
        src={`/tiers/Rank=${profile.tier}.png`}
        alt="티어"
      />
      <div className="profile-info">
        <h2 className="profile-nickname">{profile.nickname}</h2>
        <div className="profile-most3">
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
        </div>
      </div>
    </div>
  );
}
