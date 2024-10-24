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
    imageUrl: "이미지", // 기본 이미지 URL
    nickname: "Guest", // 기본 닉네임
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const responseData = await getUserProfile();
        setUserProfile(responseData);
      } catch (error) {
        setUserProfile(defaultProfile); // 오류가 발생하면 기본 프로필 사용
      }
    };

    fetchUserProfile();
  }, []);

  // userProfile이 null일 수 있으므로 확인
  const profile = userProfile || defaultProfile;

  return (
    <div className="profile-container">
      <img src={profile.imageUrl} alt="프로필 사진" className="profile-image" />
      <h2>{profile.nickname}</h2>
    </div>
  );
}
