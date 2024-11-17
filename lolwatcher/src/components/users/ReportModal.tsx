import React, { useState } from "react";
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
  championImgUrl: string;
  userReport: any;
  opponentReport: any;
  onClose: () => void; // 모달 닫기 콜백 추가
}

const CHAMPION_IMG_BASE_URL = process.env.REACT_APP_CHAMPION_IMG_BASE_URL;

export default function ReportModal({
  role,
  userName,
  championImgUrl,
  userReport,
  opponentReport,
  onClose,
}: ReportModalProps) {
  const roleMapping: { [key: string]: string } = {
    top: "탑",
    jungle: "정글",
    middle: "미드",
    bottom: "원딜",
    utility: "서포터",
  };

  const fieldMapping: { [key: string]: string } = {
    soloKills: "솔로킬",
    turretTakedowns: "포탑 기여도",
    totalDamageTaken: "받은 피해량",
    killParticipation: "킬 관여율",
    impactScore: "영향도",
    objectTakedowns: "오브젝트 기여도",
    visionScore: "맵 장악력",
    lineImpact: "라인 영향도",
    totalDamageDealtToChampions: "챔피언에게 가한 피해량",
    totalMinionsKilled: "미니언 처치 수",
    deaths: "죽은 횟수",
    skillshotsDodged: "스킬 회피",
    totalTimeCCDealt: "군중 제어 영향도",
  };

  const translatedRole = roleMapping[role] || role;

  const getTranslatedField = (field: string) => {
    return fieldMapping[field] || field; // 매핑된 한국어 반환, 없으면 원래 field
  };

  const fields = Object.keys(userReport || {}).slice(0, 5); // 필드 5개만 선택

  const [selectedField, setSelectedField] = useState<string | null>(null);

  const erf = (x: number): number => {
    const sign = x >= 0 ? 1 : -1;
    x = Math.abs(x);
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;
    const t = 1 / (1 + p * x);
    const y =
      1 -
      (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x));
    return sign * y;
  };

  const generateNormalDistribution = (mean: number, stdDev: number) => {
    const xValues: string[] = [];
    const yValues: number[] = [];

    const numPoints = 150; // 데이터 포인트 수
    const step = (6 * stdDev) / numPoints; // 평균과 표준편차를 기반으로 한 step 계산

    const minRange = Math.max(mean - 3 * stdDev, 0); // 최소 범위
    const maxRange = mean + 3 * stdDev; // 최대 범위

    for (let x = minRange; x <= maxRange; x += step) {
      const y =
        (1 / (stdDev * Math.sqrt(2 * Math.PI))) *
        Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2));
      xValues.push(x.toFixed(2)); // 소수점 두 자리까지 X축 값
      yValues.push(y); // Y축 값
    }

    return { xValues, yValues };
  };

  const getScore = (field: string, zScore: number): number => {

    // deaths 필드는 반대 점수 계산
    if (field === "deaths") {
    let score = Math.round(((-zScore + 3) / 6) * 100); // Z-Score 반대로
    if (-zScore < -3) score = 0; // 최소 값 고정
    if (-zScore > 3) score = 100; // 최대 값 고정
    return score;
  }

    let score = Math.round(((zScore + 3) / 6) * 100); // z-score를 0~100 점수로 변환
    if (zScore < -3) score = 0; // 최소 값 고정
    if (zScore > 3) score = 100; // 최대 값 고정
    return score;
  };

  const getChartData = () => {
    if (!selectedField || !userReport[selectedField]) return null;

    const mean = userReport[selectedField].avg || 0; // 평균
    const stdDev = userReport[selectedField].std_dev || 1; // 표준편차
    const zScore = userReport[selectedField].z_score || 0; // Z-Score

    const { xValues, yValues } = generateNormalDistribution(mean, stdDev);

    let zScoreX = zScore * stdDev + mean; // zScore를 기반으로 X 값 계산
    const minRange = Math.max(mean - 3 * stdDev, 0);
    const maxRange = mean + 3 * stdDev;

    if (zScoreX < minRange) zScoreX = minRange; // zScoreX가 범위를 벗어나면 조정
    if (zScoreX > maxRange) zScoreX = maxRange;

    const closestXIndex = xValues
      .map((x, index) => ({ diff: Math.abs(parseFloat(x) - zScoreX), index }))
      .reduce((prev, curr) => (prev.diff < curr.diff ? prev : curr)).index;

    const zScoreY = yValues[closestXIndex]; // 가장 가까운 X 값에 해당하는 Y 값

    // z-score 위치 데이터를 생성
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
          pointRadius: 1, // 데이터 포인트 숨기기
          pointHoverRadius: 7, // 호버 시 데이터 포인트 숨기기
        },
        {
          label: `${userName}님의 점수`,
          data: zScoreData, // z-score 위치에만 값 설정
          borderColor: "rgba(255, 99, 132, 1)", // z-score 표시 색상
          backgroundColor: "rgba(255, 99, 132, 0.2)", // z-score 점 색상
          pointRadius: 5, // z-score 위치 점 크기
          pointHoverRadius: 10, // 호버 시 점 크기 증가
          pointStyle:"circle"
        },
      ],
    };
  };

  const chartData = getChartData();

  const getPercentileText = (field: string, zScore: number): string => {
    const percentile = ((1 + erf(zScore / Math.sqrt(2))) / 2) * 100;
  
    if (field === "deaths") {
      // deaths의 경우 상위/하위 반대로
      return zScore >= 0
        ? `하위 ${percentile.toFixed(2)}%`
        : `상위 ${(100 - percentile).toFixed(2)}%`;
    }
  
    // 일반 필드의 상위/하위
    return zScore >= 0
      ? `상위 ${percentile.toFixed(2)}%`
      : `하위 ${(100 - percentile).toFixed(2)}%`;
  };

  return (
    <div className="modal-container">
      <button className="close-button" onClick={onClose}>
        ✖
      </button>
      <div
        style={{
          width: "50%",
          height: "100%",
          flexDirection: "column",
          textAlign: "center",
        }}
      >
        <div className="position-point">
          <div className="champion-profile-detail" style={{
                    backgroundImage: `url(${CHAMPION_IMG_BASE_URL}${championImgUrl})`,
                  }}></div>
          <div className="champion-name">{userName}</div>
          <div
            style={{
              fontWeight: "bold",
              color: "gray",
              fontSize: "17px",
              marginBottom:'30px',
              marginTop:'15px'
            }}
          >
            플레이 역할 : {translatedRole}
          </div>
          <div
            className="score-item"
            style={{ marginTop: "10px" }}
          >
            <div style={{ fontWeight: "bold", fontSize: "20px" }}>상대와의 비교</div>
          </div>

          {fields.map((field, index) => {
            const zScore = userReport[field]?.z_score || 0; // 해당 필드의 z-score
            const score = getScore(field, zScore); // z-score를 기반으로 점수 계산

            // 점수에 따라 CSS 클래스 설정
            const scoreClass =
              score <= 30
                ? "low-score"
                : score <= 75
                ? "common-score"
                : "great-score";

            return (
              <div
                className="score-item"
                key={index}
                onClick={() => {
                  setSelectedField(field);
                }}
                style={{ display:"flex" }}
              >
                <div style={{ fontWeight: "bold", fontSize: "20px" }}>{getTranslatedField(field)}</div>
                <div className={scoreClass}>{score}</div> {/* 동적 클래스 적용 */}
              </div>
            );
          })}

        </div>
      </div>
      <div className="report-graph">
        {chartData ? (
          <>
            <Line
              data={chartData}
              options={{
                scales: {
                  y: {
                    min: 0,
                    max: chartData
                      ? Math.max(...(chartData.datasets[0].data as number[])) * 1.1
                      : undefined,
                      ticks: {
                        display: false,
                      },
                  },
                },
                plugins: {
                  legend: {
                    position: "top",
                    display: false
                  },
                  title: {
                    display: true,
                    text: `${getTranslatedField(selectedField!)} 정규분포 그래프`,
                    font: {
                      size: 25, // 글자 크기를 30으로 설정
                    },
                    padding:{
                      top:10,
                      bottom:20,
                    }
                  },
                },
              }}
            />
            {selectedField && (
              <p
              style={{
                marginTop: "20px",
                fontSize: "25px",
                fontWeight: "bold",
                textAlign: "center",
                color: "darksalmon",
              }}
            >
              {userName} 님은 {getTranslatedField(selectedField)} 점수에서{" "} <br/>
              {getPercentileText(selectedField, userReport[selectedField]?.z_score || 0)}에
              위치하고 있어요.
            </p>
            )}
          </>
        ) : (
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            필드를 클릭하여 정규분포를 확인하세요.
          </p>
        )}
      </div>
    </div>
  );
}
