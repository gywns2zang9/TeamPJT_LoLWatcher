import React, { useState } from 'react';
import './LoginForm.css';

const LoginForm: React.FC = () => {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');

  const handleRegist = () => {
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
        <div>
          <input
            className='insert'
            type='text'
            placeholder='Riot 아이디'
          />
        </div>
        <div>
          <input
            className='insert'
            type='password'
            placeholder='Riot 비밀번호'
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
