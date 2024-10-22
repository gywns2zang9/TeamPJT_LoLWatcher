import React, { useState } from "react";
import "./SearchBar.css";

export default function SearchBar() {
  const [nickName, setNickName] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickName(e.target.value);
  };

  const handleSearch = () => {
    console.log(nickName);
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
