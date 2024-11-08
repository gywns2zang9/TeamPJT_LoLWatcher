import json
import string
from http.client import responses

from flask import Blueprint, jsonify, request
from config.mongo_config import get_mongo_rank, post_mongo_rank_analytics, get_mongo_rank_analytics
from analyze.match_analyzer import calculateStatsForTopLane,calculateStatsForJUNGLELane,calculateStatsForMIDLane,calculateStatsForBOTTOMLane,calculateStatsForUTILITYLane
from analyze.match_analyzer import calculateStatsForTopLaneByGameDuration,calculateStatsForJungleLaneByGameDuration,calculateStatsForMiddleLaneByGameDuration,calculateStatsForBottomLaneByGameDuration,calculateStatsForUtilityLaneByGameDuration
from copy import deepcopy

routes = Blueprint('routes', __name__)


@routes.route('/analytic/report', methods=['POST'])
def receive_match_data():
    data = request.get_json()

    tier = data["tier"] #티어
    division = data["division"] #위치
    #match_id = data["id"] #분석 확인 식별 용 id
    match_dto = data["matchDto"]  # match 정보

    top_info = data["top"]
    participants = process_participants(match_dto)

    for participant in participants:
        print(f'{participant}')

    collection = get_mongo_rank_analytics(tier, division)

    tier_division_field = f"{tier}_{division}"
    result = collection.find_one({},{tier_division_field: 1, "_id":0 })

    if result and tier_division_field in result:
        tier_data = result[tier_division_field]



        top_data = tier_data["top"]

        # Z-score 계산 함수
        def calculate_z_score(value, avg, std_dev):
            return (value - avg) / std_dev if std_dev != 0 else 0

        # Z-score 계산 결과를 저장할 딕셔너리
        z_scores = {}

        # top 필드의 각 항목에 대해 Z-score를 계산
        for field, value in top_info.items():
            if field in top_data:
                avg = top_data[field]["avg"]
                std_dev = top_data[field]["stdDev"]
                z_scores[field] = calculate_z_score(value, avg, std_dev)
                print(f"필드 : {field}, 평균 : {avg} , 표준편차 : {std_dev} , 전달 받은 값 : {value}, 차이 : {z_scores[field]}")

        return jsonify({
            "status": "success",
            "data": {
                "top": z_scores
            }
        }), 200

    else:
        return jsonify({"status": "error", "message": "No data found"}), 404



# 전달받은 Dto 데이터에서 participants 배열을 순회하면서 각 플레이어의 포지션에 맞는 필드를 추출하거나 계산
def process_participants(match_dto):
    participants = match_dto["info"]["participants"]
    results = []

    # 포지션별 필요한 필드 정의
    position_fields = {
        "top": ["soloKills", "turretTakedowns", "totalDamageTaken", "killParticipation", "impactScore"],
        "jungle": ["objectTakedowns", "turretTakedowns", "visionScore", "lineImpact", "impactScore"],
        "middle": ["killParticipation", "turretTakedowns", "totalDamageDealtToChampions", "objectTakedowns", "impactScore"],
        "bottom": ["totalDamageDealtToChampions", "totalMinionsKilled", "deaths", "skillshotsDodged", "impactScore"],
        "utility": ["visionScore", "totalDamageTaken", "totalDamageDealtToChampions", "totalTimeCCDealt", "impactScore"]
    }

    # 각 참가자를 순회하면서 포지션에 맞는 데이터를 추출/계산
    for participant in participants:
        team_position = participant["teamPosition"].lower()
        fields = position_fields.get(team_position, [])

        # 참가자 데이터를 저장할 딕셔너리
        player_data = {"teamPosition": team_position}
        print(f"{participant}")
        for field in fields:
            if field == "impactScore":
                # impactScore 계산
                impact_score = (
                    participant["challenges"].get("killParticipation", 0) * 0.2 +
                    participant["challenges"].get("kda", 0) * 0.1 +
                    (participant["challenges"].get("dragonTakedowns", 0) +
                     participant["challenges"].get("baronTakedowns", 0) +
                     participant["challenges"].get("riftHeraldTakedowns", 0)) * 0.2 +
                    participant.get("visionScore", 0) * 0.2 +
                    participant["challenges"].get("goldPerMinute", 0) * 0.1 +
                    participant.get("turretTakedowns", 0) * 0.1 +
                    participant.get("totalDamageDealtToChampions", 0) * 0.1
                )
                player_data["impactScore"] = impact_score

            elif field == "objectTakedowns" and team_position in ["jungle", "middle"]:
                # objectTakedowns 계산 (특정 포지션에만 적용)
                player_data["objectTakedowns"] = (
                    participant["challenges"].get("dragonTakedowns", 0) +
                    participant["challenges"].get("baronTakedowns", 0) +
                    participant["challenges"].get("riftHeraldTakedowns", 0)
                )

            elif field == "lineImpact" and team_position == "jungle":
                # lineImpact 계산 (Jungle 포지션에만 적용)
                player_data["lineImpact"] = (
                    participant["challenges"].get("takedownsFirstXMinutes", 0) +
                    participant["challenges"].get("earlyLaningPhaseGoldExpAdvantage", 0) +
                    participant["challenges"].get("laningPhaseGoldExpAdvantage", 0)
                )

            else:
                # 바로 접근 가능한 필드 값 가져오기
                player_data[field] = participant["challenges"].get(field) if field in participant["challenges"] else participant.get(field, 0)

        # 결과 리스트에 저장
        results.append(player_data)

    return results




#모든 티어별 평균, 표준 편차를 구하는 메소드
@routes.route('/analytic/tier', methods=['POST'])
def receive_request_tier_analytic():
    tiers = ["iron", "bronze", "silver", "gold", "platinum", "emerald", "diamond", "master", "grandmaster", "challenger"]
    divisions = ["i", "ii", "iii", "iv"]
    result = {}

    for tier in tiers:
        tier_divisions = divisions if tier not in ["master", "grandmaster", "challenger"] else [""]
        print(tier)
        for division in tier_divisions:
            print(division)
            try:
                collection = get_mongo_rank(tier, division)
                stats_by_time = calculate_stats_by_time(collection)
                tier_key = f"{tier}{'_' + division if division else ''}"
                result[tier_key] = stats_by_time
            except StopIteration:
                result[tier_key] = {"message": "No data found"}

    collection = post_mongo_rank_analytics()
    collection.insert_one(deepcopy(result))
    return jsonify(result), 200

# 시간별로 각 포지션의 평균 및 표준편차를 계산하여 저장
def calculate_stats_by_time(collection):
    stats = {str(minute): {} for minute in range(1, 61)}

    top_stats = calculateStatsForTopLaneByGameDuration(collection)
    jungle_stats = calculateStatsForJungleLaneByGameDuration(collection)
    middle_stats = calculateStatsForMiddleLaneByGameDuration(collection)
    bottom_stats = calculateStatsForBottomLaneByGameDuration(collection)
    utility_stats = calculateStatsForUtilityLaneByGameDuration(collection)

    for minute_stat in top_stats:
        minute = int(float(minute_stat["gameMinute"]))
        minute_str = str(minute)  # 문자열로 변환하여 사용
        if minute_str not in stats:
            stats[minute_str] = {"top": {}, "jungle": {}, "middle": {}, "bottom": {}, "utility": {}}

        stats[minute_str]["top"] = {
            "soloKills": minute_stat["soloKills"],
            "turretTakedowns": minute_stat["turretTakedowns"],
            "totalDamageTaken": minute_stat["totalDamageTaken"],
            "killParticipation": minute_stat["killParticipation"],
            "impactScore": minute_stat["impactScore"]
        }

    for minute_stat in jungle_stats:
        minute = int(float(minute_stat["gameMinute"]))
        minute_str = str(minute)  # 문자열로 변환하여 사용
        if minute_str not in stats:
            stats[minute_str] = {"top": {}, "jungle": {}, "middle": {}, "bottom": {}, "utility": {}}
        stats[minute_str]["jungle"] = {
            "objectTakedowns": minute_stat["objectTakedowns"],
            "turretTakedowns": minute_stat["turretTakedowns"],
            "visionScore": minute_stat["visionScore"],
            "lineImpact": minute_stat["lineImpact"],
            "impactScore": minute_stat["impactScore"]
        }

    for minute_stat in middle_stats:
        minute = int(float(minute_stat["gameMinute"]))
        minute_str = str(minute)  # 문자열로 변환하여 사용
        if minute_str not in stats:
            stats[minute_str] = {"top": {}, "jungle": {}, "middle": {}, "bottom": {}, "utility": {}}
        stats[minute_str]["middle"] = {
            "killParticipation": minute_stat["killParticipation"],
            "turretTakedowns": minute_stat["turretTakedowns"],
            "totalDamageDealtToChampions": minute_stat["totalDamageDealtToChampions"],
            "objectTakedowns": minute_stat["objectTakedowns"],
            "impactScore": minute_stat["impactScore"]
        }

    for minute_stat in bottom_stats:
        minute = int(float(minute_stat["gameMinute"]))
        minute_str = str(minute)  # 문자열로 변환하여 사용
        if minute_str not in stats:
            stats[minute_str] = {"top": {}, "jungle": {}, "middle": {}, "bottom": {}, "utility": {}}
        stats[minute_str]["bottom"] = {
            "totalDamageDealtToChampions": minute_stat["totalDamageDealtToChampions"],
            "totalMinionsKilled": minute_stat["totalMinionsKilled"],
            "deaths": minute_stat["deaths"],
            "skillshotsDodged": minute_stat["skillshotsDodged"],
            "impactScore": minute_stat["impactScore"]
        }

    for minute_stat in utility_stats:
        minute = int(float(minute_stat["gameMinute"]))
        minute_str = str(minute)  # 문자열로 변환하여 사용
        if minute_str not in stats:
            stats[minute_str] = {"top": {}, "jungle": {}, "middle": {}, "bottom": {}, "utility": {}}
        stats[minute_str]["utility"] = {
            "visionScore": minute_stat["visionScore"],
            "totalDamageTaken": minute_stat["totalDamageTaken"],
            "totalDamageDealtToChampions": minute_stat["totalDamageDealtToChampions"],
            "totalTimeCCDealt": minute_stat["totalTimeCCDealt"],
            "impactScore": minute_stat["impactScore"]
        }

    return stats