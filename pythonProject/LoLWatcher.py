from flask import Flask, jsonify, request

app = Flask(__name__)

timeline_data = {
    "frames": [
        {
            "timestamp": 60000,
            "participantFrames": {
                "1": {"totalGold": 500},
                "2": {"totalGold": 450},
                "3": {"totalGold": 550},
                "4": {"totalGold": 600},
                "5": {"totalGold": 480},
                "6": {"totalGold": 550},
                "7": {"totalGold": 470},
                "8": {"totalGold": 500},
                "9": {"totalGold": 450},
                "10": {"totalGold": 480}
            }
        },
        {
            "timestamp": 120000,
            "participantFrames": {
                "1": {"totalGold": 1000},
                "2": {"totalGold": 900},
                "3": {"totalGold": 1050},
                "4": {"totalGold": 1100},
                "5": {"totalGold": 980},
                "6": {"totalGold": 1050},
                "7": {"totalGold": 970},
                "8": {"totalGold": 1000},
                "9": {"totalGold": 950},
                "10": {"totalGold": 980}
            }
        }
    ]
}

def calculate_global_gold(timeline_data):
    team_100_gold = []
    team_200_gold = []

    # Timeline 데이터의 모든 프레임을 순회
    for frame in timeline_data['frames']:
        team_100_total_gold = 0
        team_200_total_gold = 0

        # 각 프레임에서 각 플레이어의 골드를 추적
        for participant_id, participant_data in frame['participantFrames'].items():
            if int(participant_id) <= 5:  # 1~5번 플레이어는 팀 100
                team_100_total_gold += participant_data['totalGold']
            else:  # 6~10번 플레이어는 팀 200
                team_200_total_gold += participant_data['totalGold']

        team_100_gold.append(team_100_total_gold)
        team_200_gold.append(team_200_total_gold)

    return team_100_gold, team_200_gold

@app.route('/')
def hello_world():
    return 'Hello World!'


@app.route('/analyze/match-data',methods=['POST'])
def analyze_match_data():
    data = request.get_json()
    print(f"Received data: {data['info']['participants'][9]['teamPosition']}")
    # 실제 처리 로직 추가
    return jsonify({"status": "success"}), 200
@app.route('/global-gold')
def global_gold():
    # 글로벌 골드 계산
    team_100_gold, team_200_gold = calculate_global_gold(timeline_data)

    # 팀별 글로벌 골드를 JSON 형태로 반환
    return jsonify({
        "team_100_gold": team_100_gold,
        "team_200_gold": team_200_gold
    })

if __name__ == '__main__':
    app.run(debug=True)