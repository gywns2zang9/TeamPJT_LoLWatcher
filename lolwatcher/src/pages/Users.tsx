import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import RecordList from "../components/games/RecordList";
import Profile from "../components/user/Profile";
import Overview from "../components/user/Overview";
import "./Users.css";

export default function Users() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  // URL의 params에서 name과 tag를 가져오거나 기본값을 설정
  const name = searchParams.get("name") || "Hide on bush";
  const tag = searchParams.get("tag") || "KR1";

  const [nickName, setNickName] = useState<string>("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const [searchName, searchTag] = nickName.split("#");
    if (!searchTag) {
      alert("올바른 형식으로 입력해주세요. (예: Hide on bush#KR1)");
      return;
    }
    navigate(`/users?name=${searchName}&tag=${searchTag}`);
    setNickName("");
  };

  return (
    <div className="users-container">
      <div className="link">
        <NavLink to="/champions">챔피언 정보</NavLink>
        <NavLink to="/logout">로그아웃</NavLink>
      </div>

      <div className="users-header">
        <h1 className="header-title">유저 검색</h1>
        <form className="header-form" onSubmit={handleSearch}>
          <input
            type="text"
            value={nickName}
            onChange={(e) => setNickName(e.target.value)}
            placeholder="Hide on bush#KR1"
            maxLength={30}
            className="header-input"
          />
          <button type="submit" className="header-btn">
            검색
          </button>
        </form>
      </div>

      <div className="users-main">
        <div className="users-profile">
          {name && tag && <Profile name={name} tag={tag} />}
        </div>
        <div className="users-article">
          <div className="article-overview">
            <Overview />
          </div>
          <div className="article-games">
            {name && tag && <RecordList name={name} tag={tag} />}
          </div>
        </div>
      </div>
    </div>
  );
}
