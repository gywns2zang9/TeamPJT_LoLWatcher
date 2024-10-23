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
  ];

  return (
    <div className="list-container">
      {records.map((record) => (
        <div key={record.id} className="record-item">
          {record.name}
        </div>
      ))}
    </div>
  );
}
