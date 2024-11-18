import React from "react";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
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
  Filler,
  Tooltip,
  Legend
);

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
}

export default function StatisticsModal({
  isOpen,
  onClose,
  championStats
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
      "지배력",
      "구원"
    ],
    datasets: [
      {
        label: `${championStats.championId} 통계`,
        data: [
          championStats.avgDPM,
          championStats.avgTDM,
          championStats.avgGrowth,
          championStats.totalCarnage,
          championStats.totalSupport,
          championStats.avgDominance,
          championStats.avgSalvation
        ],
        backgroundColor: "rgba(34, 202, 236, 0.2)",
        borderColor: "rgba(34, 202, 236, 1)",
        borderWidth: 2
      }
    ]
  };

  return (
    <div className="statistics-modal-container">
      <div className="statistics-modal-content">
        <div className="statistics-modal-body">
          <h2 className="statistics-modal-title">
            {championStats.championId} 통계
          </h2>
          <div className="radar-chart-container">
            <Radar
              data={data}
              options={{
                scales: {
                  r: {
                    beginAtZero: true,
                    ticks: { stepSize: 20 }
                  }
                }
              }}
            />
          </div>
          <button onClick={onClose} className="close-button">
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
