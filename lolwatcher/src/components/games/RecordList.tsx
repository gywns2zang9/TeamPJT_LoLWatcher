import React, { useState } from 'react';
import './RecordList.css';
import RecordReport from './RecordReport';

interface Record {
  id: number;
  name: string;
}

export default function RecordList() {
  const [selectedRecordId, setSelectedRecordId] = useState<number | null>(null); // 선택된 record id를 관리하는 상태
  const records: Record[] = [
    {
      id: 1,
      name: '게임 1',
    },
    {
      id: 2,
      name: '게임 2',
    },
    {
      id: 3,
      name: '게임 3',
    },
    {
      id: 4,
      name: '게임 4',
    },
    {
      id: 5,
      name: '게임 5',
    },
  ];

  const handleClick = (id: number) => {
    setSelectedRecordId(id === selectedRecordId ? null : id); // 클릭된 id와 상태를 비교해서 토글
  };

  return (
    <div className='recordlist-container'>
      <h1>RecordList</h1>
      {records.map((record) => (
        <React.Fragment key={record.id}>
          <div
            className='record-item'
            onClick={() => handleClick(record.id)} // record-item 전체에 클릭 이벤트 적용
          >
            {record.name}
          </div>
          {selectedRecordId === record.id && <RecordReport />}
        </React.Fragment>
      ))}
    </div>
  );
}
