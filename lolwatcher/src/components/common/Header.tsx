import React from "react";
import SearchBar from "./SearchBar";
import "./Header.css";

export default function Header() {
  return (
    <div className="header-container">
      <h1>소환사 검색</h1>
      <SearchBar />
    </div>
  );
}
