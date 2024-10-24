import React from "react";
import "./RecordList.css";

interface Record {
  id: number;
  name: string;
}

export default function RecordList() {
  const records: Record[] = [
    {
      id: 1,
      name: "게임 1",
    },
    {
      id: 2,
      name: "게임 2",
    },
    {
      id: 3,
      name: "게임 3",
    },
    {
      id: 4,
      name: "게임 4",
    },
    {
      id: 5,
      name: "게임 5",
    },
  ];

  return (
    <div className="recordlist-container">
      <h1>RecordList</h1>
      {records.map((record) => (
        <div key={record.id} className="record-item">
          {record.name}
        </div>
      ))}
    </div>
  );
}
