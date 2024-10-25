import React, { useState } from 'react';
import './ReportModal.css';

export default function ReportModal() {
  return (
    <div className='modal-container'>
      <div style={{ width: '50%', height: '100%', flexDirection: 'column', textAlign: 'center' }}>
        <div className='position-point'>
          <div className='champion-profile-detail'></div>
          <div style={{ fontWeight: 'bold', fontSize: '17px', color: 'gray', margin: 'auto', marginTop: '10px' }}>
            피즈
          </div>
          <div style={{ fontWeight: 'bold', color: 'gray', fontSize: '20px', margin: 'auto' }}>탑 라이너</div>
          <div style={{ marginTop: '10px', justifyContent: 'space-between', paddingInline: '20px' }}>
            <div style={{ fontWeight: 'bold', fontSize: '20px' }}>솔로 킬</div>
            <div style={{ fontWeight: 'bold', fontSize: '20px', color: 'gold' }}>20</div>
          </div>
          <div style={{ justifyContent: 'space-between', paddingInline: '20px' }}>
            <div style={{ fontWeight: 'bold', fontSize: '20px' }}>오브젝트 참여</div>
            <div style={{ fontWeight: 'bold', fontSize: '20px', color: 'gold' }}>20</div>
          </div>
          <div style={{ justifyContent: 'space-between', paddingInline: '20px' }}>
            <div style={{ fontWeight: 'bold', fontSize: '20px' }}>가한 피해량</div>
            <div style={{ fontWeight: 'bold', fontSize: '20px', color: 'gold' }}>20</div>
          </div>
          <div style={{ justifyContent: 'space-between', paddingInline: '20px' }}>
            <div style={{ fontWeight: 'bold', fontSize: '20px' }}>암튼 점수</div>
            <div style={{ fontWeight: 'bold', fontSize: '20px', color: 'red' }}>2</div>
          </div>
        </div>
        <div className='common-point'>
          <div style={{ fontWeight: 'bold', color: 'gray', fontSize: '20px' }}>공통 지표</div>
          <div>성장</div>
          <div>영향력</div>
        </div>
      </div>
      <div style={{ width: '50%', height: '100%', backgroundColor: 'gray' }}></div>
    </div>
  );
}
