import React from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/common/SearchBar';
import './Main.css';

export default function Main() {
  const navigate = useNavigate();

  const handleLogin = () => {
    const accessToken = sessionStorage.getItem('accessToken'); // sessionStorage 사용
    if (accessToken) {
      navigate('/record');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className='main-container'>
      <div className='main-content'>
        <h1 className='main-intro'>LoL Watcher.com</h1>
      </div>
      <SearchBar />
      <button
        className='main-btn'
        onClick={handleLogin}
      >
        서비스 이용하기
      </button>
    </div>
  );
}
