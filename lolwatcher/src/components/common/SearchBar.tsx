import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchBar.css";

export default function SearchBar() {
  const [nickName, setNickName] = useState<string>("");
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickName(e.target.value);
  };

  const handleSearch = () => {
    if (!nickName) {
      return;
    }
    console.log(nickName);
    navigate("/records");
  };

  return (
    <div>
      <input
        type="text"
        value={nickName}
        onChange={handleInputChange}
        placeholder="닉네임을 검색하세요."
      />
      <button onClick={handleSearch}>검색</button>
    </div>
  );
}
