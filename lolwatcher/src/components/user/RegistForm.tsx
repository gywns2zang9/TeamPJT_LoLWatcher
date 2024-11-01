import React, { useState } from 'react';
import './LoginForm.css';
import { useNavigate } from 'react-router-dom';

const LoginForm: React.FC = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [riotId, setRiotId] = useState('');
  const [riotPassword, setRiotPassword] = useState('');
  const navigate = useNavigate();

  const clearInput = () => {
    setUserId('');
    setPassword('');
    setRiotId('');
    setRiotPassword('');
  };

  const handleRegist = async () => {
    console.log('UserId:', userId);
    console.log('Password:', password);
    console.log('RiotAccount:', riotId);
    console.log('RiotPassword:', riotPassword);

    try {
      const response = await fetch('http://k11a601.p.ssafy.io:8080/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          password,
          riotId,
          riotPassword,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        clearInput();
        console.log('회원가입 성공 반환 값 :', result);
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
        <div>
          <input
            className='insert'
            type='text'
            placeholder='Riot 아이디'
            value={riotId}
            onChange={(e) => setRiotId(e.target.value)}
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
