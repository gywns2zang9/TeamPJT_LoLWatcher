import React, { useState } from 'react';
import './ReportModal.css';

export default function ReportModal() {
  return (
    <div className='modal-container'>
      <div
        style={{
          width: '50%',
          height: '100%',
          flexDirection: 'column',
          textAlign: 'center',
        }}
      >
        <div className='position-point'>
          <div className='champion-profile-detail'></div>
          <div className='champion-name'>피즈</div>
          <div
            style={{
              fontWeight: 'bold',
              color: 'gray',
              fontSize: '20px',
              margin: 'auto',
            }}
          >
            탑 라이너
          </div>
          <div
            className='score-item'
            style={{ marginTop: '10px' }}
          >
            <div style={{ fontWeight: 'bold', fontSize: '20px' }}>솔로 킬</div>
            <div className='great-score'>20</div>
          </div>
          <div className='score-item'>
            <div style={{ fontWeight: 'bold', fontSize: '20px' }}>오브젝트 참여</div>
            <div className='great-score'>20</div>
          </div>
          <div className='score-item'>
            <div style={{ fontWeight: 'bold', fontSize: '20px' }}>가한 피해량</div>
            <div className='great-score'>20</div>
          </div>
          <div className='score-item'>
            <div style={{ fontWeight: 'bold', fontSize: '20px' }}>암튼 점수</div>
            <div className='low-score'>2</div>
          </div>

          <div className='score-item'>
            <div style={{ fontWeight: 'bold', fontSize: '20px' }}>성장</div>
            <div className='great-score'>16</div>
          </div>
          <div className='score-item'>
            <div style={{ fontWeight: 'bold', fontSize: '20px' }}>영향력</div>
            <div className='common-score'>13</div>
          </div>
        </div>
      </div>
      <div className='report-graph'></div>
    </div>
  );
}
