import React, { useState } from 'react';
import './RecordReport.css';
import ReportModal from './modal/ReportModal';

export default function RecordReport() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 모달 열기
  const openModal = () => {
    setIsModalOpen(true);
  };

  // 모달 닫기
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className='report-container'>
      <div className='score-container'>
        <div className='my-team-container'>97</div>
        <div style={{ fontWeight: 'bold', fontSize: '20px' }}>:</div>
        <div className='enemy-team-container'>97</div>
      </div>
      <div className='report-page'>
        <div className='player-position'>
          <div className='position-line'>탑</div>
          <div className='position-line'>정글</div>
          <div className='position-line'>미드</div>
          <div className='position-line'>원딜</div>
          <div className='position-line'>서폿</div>
        </div>
        <div className='rotated-line'></div>

        <div className='player-team'>
          <div
            className='team-item'
            onClick={openModal}
          >
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
            <div className='champion-profile'></div>
            <div>S2xSense</div>
          </div>
          <div className='team-item'>
            <div>20</div>
            <div className='champion-profile'></div>
            <div>로댕맨</div>
          </div>
          <div className='team-item'>
            <div>20</div>
            <div className='champion-profile'></div>
            <div>로댕맨</div>
          </div>
          <div className='team-item'>
            <div>20</div>
            <div className='champion-profile'></div>
            <div>로댕맨</div>
          </div>
          <div className='team-item'>
            <div>20</div>
            <div className='champion-profile'></div>
            <div>로댕맨</div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div
          className='modal-backdrop'
          onClick={closeModal}
        >
          <div
            className='modal-content'
            onClick={(e) => e.stopPropagation()}
          >
            <ReportModal />
          </div>
        </div>
      )}
    </div>
  );
}
