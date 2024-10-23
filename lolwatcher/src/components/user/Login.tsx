import React, { useState } from 'react';
import './Login.css';

const Login: React.FC = () => {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('Account:', account);
    console.log('Password:', password);
  };

  return (
    <div className='container'>
      <div className='insert-container'>
        <h2 className='logo'>LoLWatcher</h2>
        <div>
          <input
            className='insert'
            type='text'
            value={account}
            onChange={(e) => setAccount(e.target.value)}
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
            onClick={handleLogin}
          >
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
