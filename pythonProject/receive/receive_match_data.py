import string
from flask import Blueprint, jsonify, request
from config.mongo_config import get_mongo_client, get_mongo_rank
from analyze.match_analyzer import analyze_participants

routes = Blueprint('routes', __name__)

db_collection = get_mongo_client()  # MongoDB 컬렉션 가져오기

@routes.route('/analyze/match-data', methods=['POST'])
def analyze_match_data():
    data = request.get_json()
    match_id = data['metadata']['matchId']

    existing_match = db_collection.find_one({"metadata.matchId": match_id})
    if existing_match is None:
        db_collection.insert_one(data)
        print(f"Data with matchId {match_id} inserted successfully.")
    else:
        print(f"Data with matchId {match_id} already exists. Skipping insertion.")

    analyze_participants(data)
    return jsonify({"status": "success"}), 200


@routes.route('/analyze/rank-data', methods=['POST'])
def classify_rank_data():
    data = request.get_json()

    db_rank_collection = get_mongo_rank(string.lower(data['tear']), data['division'])

    match_id = data['metadata']['matchId']

    existing_match = db_rank_collection.find_one({"metadata.matchId": match_id})
    if existing_match is None:
        db_rank_collection.insert_one(data)
        print(f"Data with matchId {match_id} inserted successfully.")
    else:
        print(f"Data with matchId {match_id} already exists. Skipping insertion.")

    return jsonify({"status": "success"}), 200


def topLineReport(collection):
    return collection.aggregate([
        {
            "$unwind": "$matchDto.info.participants"
        },
        {
            "$match": {
                "matchDto.info.participants.teamPosition": "TOP"
            }
        },
        {
            "$project": {
                "_id": 1,
                "soloKills": "$matchDto.info.participants.challenges.soloKills",
                "turretTakedowns": "$matchDto.info.participants.turretTakedowns",
                "totalDamageTaken": "$matchDto.info.participants.totalDamageTaken",
                "killParticipation": "$matchDto.info.participants.challenges.killParticipation",
                "kda": "$matchDto.info.participants.challenges.kda",
                "dragonTakedowns": "$matchDto.info.participants.challenges.dragonTakedowns",
                "baronTakedowns": "$matchDto.info.participants.challenges.baronTakedowns",
                "visionScore": "$matchDto.info.participants.challenges.visionScore",
                "goldPerMinute": "$matchDto.info.participants.challenges.goldPerMinute",
                "totalDamageDealtToChampions": "$matchDto.info.participants.totalDamageDealtToChampions",
                # impactScore 계산을 위해 필요한 요소들
                "impactScore": {
                    "$add": [
                        {"$multiply": ["$matchDto.info.participants.challenges.killParticipation", 0.2]},
                        {"$multiply": ["$matchDto.info.participants.challenges.kda", 0.1]},
                        {"$multiply": [{"$add": ["$matchDto.info.participants.challenges.dragonTakedowns",
                                                 "$matchDto.info.participants.challenges.baronTakedowns"]}, 0.2]},
                        {"$multiply": ["$matchDto.info.participants.challenges.visionScore", 0.2]},
                        {"$multiply": ["$matchDto.info.participants.challenges.goldPerMinute", 0.1]},
                        {"$multiply": ["$matchDto.info.participants.turretTakedowns", 0.1]},
                        {"$multiply": ["$matchDto.info.participants.totalDamageDealtToChampions", 0.1]}
                    ]
                }
            }
        },
        {
            "$group": {
                "_id": "$_id",
                "avgSoloKills": {"$avg": "$soloKills"},
                "stdDevSoloKills": {"$stdDevPop": "$soloKills"},

                "avgTurretTakedowns": {"$avg": "$turretTakedowns"},
                "stdDevTurretTakedowns": {"$stdDevPop": "$turretTakedowns"},

                "avgTotalDamageTaken": {"$avg": "$totalDamageTaken"},
                "stdDevTotalDamageTaken": {"$stdDevPop": "$totalDamageTaken"},

                "avgKillParticipation": {"$avg": "$killParticipation"},
                "stdDevKillParticipation": {"$stdDevPop": "$killParticipation"},

                "avgImpactScore": {"$avg": "$impactScore"},
                "stdDevImpactScore": {"$stdDevPop": "$impactScore"}
            }
        },
        {
            "$project": {
                "_id": 0,
                "avgSoloKills": 1,
                "stdDevSoloKills": 1,

                "avgTurretTakedowns": 1,
                "stdDevTurretTakedowns": 1,

                "avgTotalDamageTaken": 1,
                "stdDevTotalDamageTaken": 1,

                "avgKillParticipation": 1,
                "stdDevKillParticipation": 1,

                "avgImpactScore": 1,
                "stdDevImpactScore": 1
            }
        }
    ])


@routes.route('/tier/match-list', methods=['GET'])
def get_top_kills():
    tier = request.args.get('tier')
    division = request.args.get('division')
    soloKills = float(request.args.get('soloKills'))
    turretTakedowns = float(request.args.get('turretTakedowns'))
    totalDamageTaken = float(request.args.get('totalDamageTaken'))
    killParticipation = float(request.args.get('killParticipation'))

    collection = get_mongo_rank(tier, division)

    try:
        result = topLineReport(collection).next()
    except StopIteration:
        return jsonify({"tier": tier, "division": division, "message": "No data found"})

    # Z-score 계산 함수
    def calculate_z_score(value, avg, std_dev):
        return (value - avg) / std_dev if std_dev != 0 else 0

    # 각 지표에 대해 Z-score 계산
    soloKillsZ = calculate_z_score(soloKills, result["avgSoloKills"], result["stdDevSoloKills"])
    turretTakedownsZ = calculate_z_score(turretTakedowns, result["avgTurretTakedowns"], result["stdDevTurretTakedowns"])
    totalDamageTakenZ = calculate_z_score(totalDamageTaken, result["avgTotalDamageTaken"],
                                          result["stdDevTotalDamageTaken"])
    killParticipationZ = calculate_z_score(killParticipation, result["avgKillParticipation"],
                                           result["stdDevKillParticipation"])

    return jsonify({
        "tier": tier,
        "division": division,
        "soloKillsDistribution": result["avgSoloKills"],
        "turretTakedownsDistribution": result["avgTurretTakedowns"],
        "totalDamageTakenDistribution": result["avgTotalDamageTaken"],
        "killParticipationDistribution": result["avgKillParticipation"],
        "playerZScores": {
            "soloKillsZ": soloKillsZ,
            "turretTakedownsZ": turretTakedownsZ,
            "totalDamageTakenZ": totalDamageTakenZ,
            "killParticipationZ": killParticipationZ
        }
    })