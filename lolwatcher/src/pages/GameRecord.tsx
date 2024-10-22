import React, { useEffect, useState } from "react";
// import { getGameRecords } from "../api/gameApi";

interface GameRecord {
  id: number;
  title: string;
  date: string;
}

const Records: React.FC = () => {
  const [records, setRecords] = useState<GameRecord[]>([]);

  // useEffect(() => {
  //   const fetchRecords = async () => {
  //     try {
  //       const response = await getGameRecords(); // getGameRecords가 비동기 함수라고 가정
  //       setRecords(response.data); // response.data에 게임 목록이 있다고 가정
  //       setLoading(false);
  //     } catch (err) {
  //       setError("게임 목록을 불러오는 중 오류가 발생했습니다.");
  //       setLoading(false);
  //     }
  //   };

  //   fetchRecords();
  // }, []);

  return (
    <div className="records">
      <h1>게임 목록</h1>
      <ul>
        {records.map((record) => (
          <li key={record.id}>
            {record.title} - {record.date}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Records;
