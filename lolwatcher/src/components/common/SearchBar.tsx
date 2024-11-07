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
    if (!nickName) return;

    const [name, tag] = nickName.split("#");
    if (!tag) {
      alert("올바른 형식으로 입력해주세요. (예: 카림sk#kr1)");
      return;
    }

    console.log(`Name: ${name}, Tag: ${tag}`);
    navigate(`/records?name=${name}&tag=${tag}`);
  };

  return (
    <div>
      <input
        type="text"
        value={nickName}
        onChange={handleInputChange}
        placeholder="닉네임#태그 형식으로 검색하세요."
      />
      <button onClick={handleSearch}>검색</button>
    </div>
  );
}
