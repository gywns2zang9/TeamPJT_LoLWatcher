import React from "react";
import SearchBar from "./SearchBar";
import "./Header.css";

export default function Header() {
  return (
    <div className="header-container">
      <h1>Header</h1>
      <SearchBar />
    </div>
  );
}
