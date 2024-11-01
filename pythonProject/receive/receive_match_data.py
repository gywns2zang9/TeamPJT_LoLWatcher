import string

from flask import Blueprint, jsonify, request
from config.mongo_config import get_mongo_client, get_mongo_rank, get_mongo_rank
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


#넘어오는 정보
@routes.route('/analyze/rank-data', methods=['POST'])
def classify_rank_data():
    data = request.get_json()

    db_rank_collection = get_mongo_rank(string.lower(data['tear']),data['division'])

    match_id = data['metadata']['matchId']

    existing_match = db_rank_collection.find_one({"metadata.matchId": match_id})
    if existing_match is None:
        db_rank_collection.insert_one(data)
        print(f"Data with matchId {match_id} inserted successfully.")
    else:
        print(f"Data with matchId {match_id} already exists. Skipping insertion.")

    return jsonify({"status": "success"}), 200