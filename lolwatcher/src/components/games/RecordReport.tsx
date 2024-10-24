import React from 'react';
import './RecordReport.css';

export default function RecordReport() {
  return (
    <div className='report-container'>
      <div className='score-container'>
        <div className='my-team-container'>97</div>
        <div style={{ fontWeight: 'bold', fontSize: '20px' }}>:</div>
        <div className='enemy-team-container'>97</div>
      </div>
      <div className='report-page'>
        <div className='player-team'>
          <div className='team-item'>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div>탑</div>
              <div className='champion-profile'></div>
            </div>
            <div>로댕맨</div>
            <div>20</div>
          </div>
          <div className='team-item'>
            <div className='champion-profile'></div>
            <div>로댕맨</div>
            <div>20</div>
          </div>
          <div className='team-item'>
            <div className='champion-profile'></div>
            <div>로댕맨</div>
            <div>20</div>
          </div>
          <div className='team-item'>
            <div className='champion-profile'></div>
            <div>로댕맨</div>
            <div>20</div>
          </div>
          <div className='team-item'>
            <div className='champion-profile'></div>
            <div>로댕맨</div>
            <div>20</div>
          </div>
        </div>
        <div className='rotated-line'></div>
        <div className='enemy-team'>
          <div className='team-item'>
            <div>20</div>
            <div>S2xSense</div>
            <div className='champion-profile'></div>
          </div>
          <div className='team-item'>
            <div className='champion-profile'></div>
            <div>로댕맨</div>
            <div>20</div>
          </div>
          <div className='team-item'>
            <div className='champion-profile'></div>
            <div>로댕맨</div>
            <div>20</div>
          </div>
          <div className='team-item'>
            <div className='champion-profile'></div>
            <div>로댕맨</div>
            <div>20</div>
          </div>
          <div className='team-item'>
            <div className='champion-profile'></div>
            <div>로댕맨</div>
            <div>20</div>
          </div>
        </div>
      </div>
    </div>
  );
}
