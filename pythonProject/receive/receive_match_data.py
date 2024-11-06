import string
from flask import Blueprint, jsonify, request
from config.mongo_config import get_mongo_rank
from analyze.match_analyzer import calculateStatsForTopLane

routes = Blueprint('routes', __name__)



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
        result = calculateStatsForTopLane(collection).next()
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