import json
import string
from http.client import responses

from flask import Blueprint, jsonify, request
from config.mongo_config import get_mongo_rank
from analyze.match_analyzer import calculateStatsForTopLane,calculateStatsForJUNGLELane,calculateStatsForMIDLane,calculateStatsForBOTTOMLane,calculateStatsForUTILITYLane


routes = Blueprint('routes', __name__)



# @routes.route('/analyze/rank-data', methods=['POST'])
# def classify_rank_data():
#     data = request.get_json()
#
#     db_rank_collection = get_mongo_rank(string.lower(data['tear']), data['division'])
#
#     match_id = data['metadata']['matchId']
#
#     existing_match = db_rank_collection.find_one({"metadata.matchId": match_id})
#     if existing_match is None:
#         db_rank_collection.insert_one(data)
#         print(f"Data with matchId {match_id} inserted successfully.")
#     else:
#         print(f"Data with matchId {match_id} already exists. Skipping insertion.")
#
#     return jsonify({"status": "success"}), 200


@routes.route('/analytic/tier', methods=['GET'])
def receive_request_tier_analytic():
    data = request.get_json()

    tier = data['tier']
    division = data['division']
    print(f"{tier}_{division}")
    collection = get_mongo_rank(tier, division)
    try:
        topAnalyze = calculateStatsForTopLane(collection).next()
        jungleAnalyze = calculateStatsForJUNGLELane(collection).next()
        midAnalyze = calculateStatsForMIDLane(collection).next()
        bottomAnalyze = calculateStatsForBOTTOMLane(collection).next()
        utilityAnalyze = calculateStatsForUTILITYLane(collection).next()

        print("탑 분석 결과:")
        print(json.dumps(topAnalyze, indent=4, ensure_ascii=False))

        print("정글 분석 결과:")
        print(json.dumps(jungleAnalyze, indent=4, ensure_ascii=False))

        print("미드 분석 결과:")
        print(json.dumps(midAnalyze, indent=4, ensure_ascii=False))

        print("바텀 분석 결과:")
        print(json.dumps(bottomAnalyze, indent=4, ensure_ascii=False))

        print("유틸리티 분석 결과:")
        print(json.dumps(utilityAnalyze, indent=4, ensure_ascii=False))

        return jsonify({"status": "success"}), 200
    except StopIteration:
        return jsonify({"tier": tier, "division": division, "message": "No data found"})




@routes.route('/tier/match-list', methods=['GET'])
def receive_match_data():
    data = request.get_json()

    tier = data.get('tier')
    division = data.get('division')
    matchInfo = data.get('matchInfo')

    collection = get_mongo_rank(tier, division)

    try:
        topAnalayze = calculateStatsForTopLane(collection).next()
        jungleAnalayze = calculateStatsForJUNGLELane(collection).next()
        midAnalayze = calculateStatsForMIDLane(collection).next()
        bottomAnalayze = calculateStatsForBOTTOMLane(collection).next()
        utilityAnalayze = calculateStatsForUTILITYLane(collection).next()
    except StopIteration:
        return jsonify({"tier": tier, "division": division, "message": "No data found"})

    # Z-score 계산 함수
    def calculate_z_score(value, avg, std_dev):
        return (value - avg) / std_dev if std_dev != 0 else 0

    return jsonify({"status": "success"}), 200