import React, { useState, useEffect } from "react";
import "./ReportModal.css";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface ReportModalProps {
  role: string;
  userName: string;
  userReport: any;
  opponentReport: any;
}

export default function ReportModal({
  role,
  userName,
  userReport,
  opponentReport,
}: ReportModalProps) {
  const roleMapping: { [key: string]: string } = {
    top: "탑",
    jungle: "정글",
    middle: "미드",
    bottom: "원딜",
    utility: "서포터",
  };

  const translatedRole = roleMapping[role] || role;

  const fields = Object.keys(userReport || {}).slice(0, 5); // 필드 5개만 선택

  const [selectedField, setSelectedField] = useState<string | null>(null);

  const generateNormalDistribution = (mean: number, stdDev: number) => {
    const xValues = [];
    const yValues = [];
    
    const numPoints = 150; // 생성할 데이터 포인트 개수 (100~200이 적절)
    const step = (6 * stdDev) / numPoints; // 평균과 표준편차 기반으로 step 계산
    
    const minRange = Math.max(mean - 3 * stdDev, 0); // X축 범위 제한 (음수 방지)
    const maxRange = mean + 3 * stdDev;

    xValues.push(minRange.toFixed(2));
    xValues.push(maxRange.toFixed(2));
  
    for (let x = minRange; x <= maxRange; x += step) {
      const y =
        (1 / (stdDev * Math.sqrt(2 * Math.PI))) *
        Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2));
      xValues.push(x.toFixed(2)); // X축 값 (소수점 2자리까지)
      yValues.push(y);
    }
  
    return { xValues, yValues };
  };
  

  const getChartData = () => {
    if (!selectedField || !userReport[selectedField]) return null;
  
    const mean = userReport[selectedField].avg || 0; // 평균
    const stdDev = userReport[selectedField].std_dev || 1; // 표준편차
    const zScore = userReport[selectedField].z_score || 0; // z-score
  
    // 정규분포 데이터 생성
    const { xValues, yValues } = generateNormalDistribution(mean, stdDev);
  
    // zScoreX 계산
    let zScoreX = zScore * stdDev + mean;
    const minRange = Math.max(mean - 3 * stdDev, 0); // 최소 X 범위
    const maxRange = mean + 3 * stdDev; // 최대 X 범위
  
    if (zScoreX < minRange) zScoreX = minRange; // 좌측 경계로 이동
    if (zScoreX > maxRange) zScoreX = maxRange; // 우측 경계로 이동
  
    // zScoreX와 가장 가까운 X값 찾기
    const closestXIndex = xValues.reduce((closestIndex, currentX, currentIndex) => {
      const currentDiff = Math.abs(parseFloat(currentX) - zScoreX);
      const closestDiff = Math.abs(parseFloat(xValues[closestIndex]) - zScoreX);
      return currentDiff < closestDiff ? currentIndex : closestIndex;
    }, 0);
  
    // Y값 계산 (가장 가까운 X값 기준)
    const zScoreY = yValues[closestXIndex];
  
    // z-score 위치 점 추가
    const zScoreData = Array(xValues.length).fill(null);
    zScoreData[closestXIndex] = zScoreY;
  
    return {
      labels: xValues, // X축 값
      datasets: [
        {
          label: `${selectedField}의 정규분포`,
          data: yValues,
          borderColor: "rgba(75, 192, 192, 1)", // 선 색상
          backgroundColor: "rgba(75, 192, 192, 0.2)", // 선 아래 채우기 색상
          tension: 0.2, // 선의 부드러움
          pointRadius: 0, // 데이터 포인트 숨기기
          pointHoverRadius: 0, // 호버 시 데이터 포인트 숨기기
        },
        {
          label: `${userName}의 위치 (z-score: ${zScore})`,
          data: zScoreData, // z-score 위치에만 값 설정
          borderColor: "rgba(255, 99, 132, 1)", // z-score 표시 색상
          backgroundColor: "rgba(255, 99, 132, 1)", // z-score 점 색상
          pointRadius: 5, // z-score 위치 점 크기
          pointHoverRadius: 7, // 호버 시 점 크기 증가
        },
      ],
    };
  };

  const chartData = getChartData();

  return (
    <div className="modal-container">
      <div
        style={{
          width: "50%",
          height: "100%",
          flexDirection: "column",
          textAlign: "center",
        }}
      >
        <div className="position-point">
          <div className="champion-profile-detail"></div>
          <div className="champion-name">{userName}</div>
          <div
            style={{
              fontWeight: "bold",
              color: "gray",
              fontSize: "20px",
              margin: "auto",
            }}
          >
            {translatedRole}
          </div>
          <div
            className="score-item"
            style={{ marginTop: "10px" }}
          >
            <div style={{ fontWeight: "bold", fontSize: "20px" }}>상대와의 비교</div>
          </div>

          {fields.map((field, index) => (
            <div
              className="score-item"
              key={index}
              onClick={() =>{ setSelectedField(field)
                if (userReport[field]) {
                  console.log("Field:", field);
                  console.log("Average (avg):", userReport[field].avg);
                  console.log("Standard Deviation (std_dev):", userReport[field].std_dev);
                  console.log("Z-Score (z_score):", userReport[field].z_score);
                } else {
                  console.log(`No data available for field: ${field}`);
                }

              }

                
              } // 필드 선택
              style={{ cursor: "pointer" }}
            >
              <div style={{ fontWeight: "bold", fontSize: "20px" }}>
                {field}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="report-graph">
        {chartData ? (
          <Line
            data={chartData}
            options={{
              
              plugins: {
                legend: {
                  position: "top",
                },
                title: {
                  display: true,
                  text: `${selectedField}의 정규분포 그래프`,
                },
              },
            }}
          />
        ) : (
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            필드를 클릭하여 정규분포를 확인하세요.
          </p>
        )}
      </div>
    </div>
  );
}
