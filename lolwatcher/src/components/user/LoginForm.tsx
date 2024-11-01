import React, { useState } from 'react';
import './LoginForm.css';
import { useNavigate } from 'react-router-dom';

const LoginForm: React.FC = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    console.log('UserId:', userId);
    console.log('Password:', password);
    console.log('---------------');
    try {
      const response = await fetch('https://lolwatcher.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          password,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        //setAccessToken(result.accessToken);
        //setRefreshToken(result.refreshToken);
        clearInput();
        console.log('로그인 성공:', result);
        navigate('/records');
      } else {
        console.error('로그인 실패');
      }
    } catch (error) {
      console.error('오류 발생:', error);
    }
  };

  const handleRegist = () => {
    clearInput();
    navigate('/regist');
  };

  const clearInput = () => {
    setUserId('');
    setPassword('');
  };

  return (
    <div className='container'>
      <div className='insert-container'>
        <h2 className='logo'>LoLWatcher</h2>
        <div>
          <input
            className='insert'
            type='text'
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder='아이디'
          />
        </div>
        <div>
          <input
            className='insert'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='비밀번호'
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <button
            className='login-button'
            onClick={handleLogin}
          >
            로그인
          </button>
          <button
            className='login-button'
            onClick={handleRegist}
          >
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
