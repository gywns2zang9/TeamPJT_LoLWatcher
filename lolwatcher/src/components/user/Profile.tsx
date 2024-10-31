import React, { useEffect, useState } from "react";
import { getUserProfile } from "../../api/gameApi";
import "./Profile.css";

interface UserProfile {
  imageUrl: string;
  nickname: string;
}

export default function Profile() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const defaultProfile: UserProfile = {
    imageUrl: "profile/default-profile.jpg",
    nickname: "Hide on bush #KR1",
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const responseData = await getUserProfile();
        setUserProfile(responseData);
      } catch (error) {
        setUserProfile(defaultProfile);
      }
    };

    fetchUserProfile();
  }, []);

  const profile = userProfile || defaultProfile;

  return (
    <div className="profile-container">
      <div className="profile-image">
        <img
          src={profile.imageUrl}
          alt="프로필 사진"
          className="profile-image"
        />
      </div>
      <div className="profile-info">
        <h2>{profile.nickname}</h2>
        <div className="profile-most3">
          <img src="profile/Leblanc_0.jpg" alt="모스트1" />
          <img src="profile/Tristana_0.jpg" alt="모스트2" />
          <img src="profile/Lucian_0.jpg" alt="모스트3" />
        </div>
      </div>
    </div>
  );
}
