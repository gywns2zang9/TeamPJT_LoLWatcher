import React from "react";
import { Radar } from "react-chartjs-2";
import { Bar } from "react-chartjs-2"; // Bar 컴포넌트 import
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  BarElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from "chart.js";
import "./StatisticsModal.css"; // CSS file import

// Register required Chart.js modules
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  BarElement,
  Filler,
  Tooltip,
  Legend
);
const CHAMPION_IMG_BASE_URL =
  "https://ddragon.leagueoflegends.com/cdn/14.22.1/img/champion/";

interface ChampionStats {
  championId: number;
  avgDPM: number;
  avgTDM: number;
  avgGrowth: number;
  totalCarnage: number;
  totalSupport: number;
  avgDominance: number;
  avgSalvation: number;
}

interface StatisticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  championStats?: ChampionStats;
  championName?: string; // 챔피언 이름 추가
  championImgUrl?: string; // 챔피언 이미지 URL 추가
}

export default function StatisticsModal({
  isOpen,
  onClose,
  championStats,
  championName,
  championImgUrl, // 새로운 props
}: StatisticsModalProps) {
  if (!isOpen || !championStats) return null;
  // 전달된 championStats 데이터 확인
  console.log("Modal Data:", championStats);
  const data = {
    labels: [
      "분당 평균 피해량",
      "팀 기여도",
      "성장률",
      "학살 횟수",
      "지원 횟수",
    ],
    datasets: [
      {
        label: `${championName} 통계`,
        data: [
          championStats.avgDPM,
          championStats.avgTDM,
          championStats.avgGrowth,
          championStats.totalCarnage,
          championStats.totalSupport,
        ],
        backgroundColor: "rgba(34, 202, 236, 0.2)",
        borderColor: "rgba(34, 202, 236, 1)",
        borderWidth: 2
      }
    ]
  };

  return (
    <div className="statistics-modal-container">
      <div className="statistics-modal-body">
        <div style={{width:'100%'}}>
          <div className="champion-image" style={{backgroundImage: `url(${CHAMPION_IMG_BASE_URL}${championImgUrl}.png)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",}}></div>
        </div>
        <h2 className="statistics-modal-title">
          {championName}
        </h2>
        <div className="radar-chart-container">
        <Bar
            data={data}
            options={{
              indexAxis: "y", // Bar 차트를 수평 방향으로 설정
              plugins: {
                legend: {
                  display: false, // 범례 숨기기
                },
              },
              scales: {
                x: {
                  grid: {
                    color: "goldenrod", // X축 격자 색상
                  },
                  ticks: {
                    color: "white", // X축 눈금 색상
                  },
                  beginAtZero: true,
                },
                y: {
                  grid: {
                    color: "goldenrod", // Y축 격자 색상
                  },
                  ticks: {
                    color: "white", // Y축 라벨 색상
                    font: {
                      size: 15, // Y축 라벨 크기
                      weight: "bold",
                    },
                  },
                },
              },
            }}
          />
        </div>
        <button onClick={onClose} className="close-button">
          X
        </button>
      </div>
    </div>
  );
}
