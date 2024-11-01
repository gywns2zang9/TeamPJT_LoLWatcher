import React, { useState } from 'react';
import './LoginForm.css';
import { useNavigate } from 'react-router-dom';

const LoginForm: React.FC = () => {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [riotAccount, setRiotAccount] = useState('');
  const [riotPassword, setRiotPassword] = useState('');
  const navigate = useNavigate();

  const clearInput = () => {
    setAccount('');
    setPassword('');
    setRiotAccount('');
    setRiotPassword('');
  };

  const handleRegist = async () => {
    console.log('Account:', account);
    console.log('Password:', password);
    console.log('RiotAccount:', riotAccount);
    console.log('RiotPassword:', riotPassword);

    try {
      const response = await fetch('http://k11a601.p.ssafy.io:8080/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          account,
          password,
          riotAccount,
          riotPassword,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        clearInput();
        console.log('회원가입 성공:', result);
        navigate('/login');
      } else {
        console.error('회원가입 실패');
      }
    } catch (error) {
      console.error('오류 발생:', error);
    }
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
        <div>
          <input
            className='insert'
            type='text'
            placeholder='Riot 아이디'
            value={riotAccount}
            onChange={(e) => setRiotAccount(e.target.value)}
          />
        </div>
        <div>
          <input
            className='insert'
            type='password'
            placeholder='Riot 비밀번호'
            value={riotPassword}
            onChange={(e) => setRiotPassword(e.target.value)}
          />
        </div>
        <button
          className='regist-button'
          onClick={handleRegist}
        >
          회원가입
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
