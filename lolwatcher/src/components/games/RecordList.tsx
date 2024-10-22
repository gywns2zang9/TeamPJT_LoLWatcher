import React from "react";

export default function RecordList() {
  const records = [
    { id: 1, name: "게임 1" },
    { id: 2, name: "게임 2" },
    { id: 3, name: "게임 3" },
  ];

  return (
    <ul>
      {records.map((record) => (
        <li key={record.id}>{record.name}</li>
      ))}
    </ul>
  );
}
