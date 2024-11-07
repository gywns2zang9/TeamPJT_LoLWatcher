import json
import string
from http.client import responses

from flask import Blueprint, jsonify, request
from config.mongo_config import get_mongo_rank, post_mongo_rank_analytics
from analyze.match_analyzer import calculateStatsForTopLane,calculateStatsForJUNGLELane,calculateStatsForMIDLane,calculateStatsForBOTTOMLane,calculateStatsForUTILITYLane


routes = Blueprint('routes', __name__)


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



#모든 티어별 평균, 표준 편차를 구하는 메소드
@routes.route('/analytic/tier', methods=['POST'])
def receive_request_tier_analytic():
    tiers = ["iron", "bronze", "silver", "gold", "platinum", "emerald", "diamond", "master", "grandmaster",
             "challenger"]
    divisions = ["i", "ii", "iii", "iv"]
    result={}

    for tier in tiers:
        # 상위 티어에 대해 division을 빈 문자열로 설정하여 반복
        tier_divisions = divisions if tier not in ["master", "grandmaster", "challenger"] else [""]
        print(f"{tier}")
        for division in tier_divisions:
            print(f"{division}")
            try:
                collection = get_mongo_rank(tier, division)
                stats = get_stats_for_tier(collection)
                tier_key = f"{tier}{'_' + division if division else ''}"
                result[tier_key] = stats
            except StopIteration:
                result[tier_key] = {"message": "No data found"}

    collection = post_mongo_rank_analytics()
    collection.insert_one(result)
    return jsonify(result),200

# 각 라인의 통계별 avg, stdDev 필드 추가
def get_stats_for_tier(collection):
    return {
        "top": {
            "soloKills": {
                "avg": calculateStatsForTopLane(collection).next()["avgSoloKills"],
                "stdDev": calculateStatsForTopLane(collection).next()["stdDevSoloKills"]
            },
            "turretTakedowns": {
                "avg": calculateStatsForTopLane(collection).next()["avgTurretTakedowns"],
                "stdDev": calculateStatsForTopLane(collection).next()["stdDevTurretTakedowns"]
            },
            "totalDamageTaken": {
                "avg": calculateStatsForTopLane(collection).next()["avgTotalDamageTaken"],
                "stdDev": calculateStatsForTopLane(collection).next()["stdDevTotalDamageTaken"]
            },
            "killParticipation": {
                "avg": calculateStatsForTopLane(collection).next()["avgKillParticipation"],
                "stdDev": calculateStatsForTopLane(collection).next()["stdDevKillParticipation"]
            },
            "impactScore": {
                "avg": calculateStatsForTopLane(collection).next()["avgImpactScore"],
                "stdDev": calculateStatsForTopLane(collection).next()["stdDevImpactScore"]
            }
        },
        "jungle": {
            "objectTakedowns": {
                "avg": calculateStatsForJUNGLELane(collection).next()["avgObjectTakedowns"],
                "stdDev": calculateStatsForJUNGLELane(collection).next()["stdDevObjectTakedowns"]
            },
            "turretTakedowns": {
                "avg": calculateStatsForJUNGLELane(collection).next()["avgTurretTakedowns"],
                "stdDev": calculateStatsForJUNGLELane(collection).next()["stdDevTurretTakedowns"]
            },
            "visionScore": {
                "avg": calculateStatsForJUNGLELane(collection).next()["avgVisionScore"],
                "stdDev": calculateStatsForJUNGLELane(collection).next()["stdDevVisionScore"]
            },
            "lineImpact": {
                "avg": calculateStatsForJUNGLELane(collection).next()["avgLineImpact"],
                "stdDev": calculateStatsForJUNGLELane(collection).next()["stdDevLineImpact"]
            },
            "impactScore": {
                "avg": calculateStatsForJUNGLELane(collection).next()["avgImpactScore"],
                "stdDev": calculateStatsForJUNGLELane(collection).next()["stdDevImpactScore"]
            }
        },
        "mid": {
            "killParticipation": {
                "avg": calculateStatsForMIDLane(collection).next()["avgKillParticipation"],
                "stdDev": calculateStatsForMIDLane(collection).next()["stdDevKillParticipation"]
            },
            "turretTakedowns": {
                "avg": calculateStatsForMIDLane(collection).next()["avgTurretTakedowns"],
                "stdDev": calculateStatsForMIDLane(collection).next()["stdDevTurretTakedowns"]
            },
            "totalDamageDealtToChampions": {
                "avg": calculateStatsForMIDLane(collection).next()["avgTotalDamageDealtToChampions"],
                "stdDev": calculateStatsForMIDLane(collection).next()["stdDevTotalDamageDealtToChampions"]
            },
            "objectTakedowns": {
                "avg": calculateStatsForMIDLane(collection).next()["avgObjectTakedowns"],
                "stdDev": calculateStatsForMIDLane(collection).next()["stdDevObjectTakedowns"]
            },
            "impactScore": {
                "avg": calculateStatsForMIDLane(collection).next()["avgImpactScore"],
                "stdDev": calculateStatsForMIDLane(collection).next()["stdDevImpactScore"]
            }
        },
        "bottom": {
            "totalDamageDealtToChampions": {
                "avg": calculateStatsForBOTTOMLane(collection).next()["avgTotalDamageDealtToChampions"],
                "stdDev": calculateStatsForBOTTOMLane(collection).next()["stdDevTotalDamageDealtToChampions"]
            },
            "totalMinionsKilled": {
                "avg": calculateStatsForBOTTOMLane(collection).next()["avgTotalMinionsKilled"],
                "stdDev": calculateStatsForBOTTOMLane(collection).next()["stdDevTotalMinionsKilled"]
            },
            "deaths": {
                "avg": calculateStatsForBOTTOMLane(collection).next()["avgDeaths"],
                "stdDev": calculateStatsForBOTTOMLane(collection).next()["stdDevDeaths"]
            },
            "skillshotsDodged": {
                "avg": calculateStatsForBOTTOMLane(collection).next()["avgSkillshotsDodged"],
                "stdDev": calculateStatsForBOTTOMLane(collection).next()["stdDevSkillshotsDodged"]
            },
            "impactScore": {
                "avg": calculateStatsForBOTTOMLane(collection).next()["avgImpactScore"],
                "stdDev": calculateStatsForBOTTOMLane(collection).next()["stdDevImpactScore"]
            }
        },
        "utility": {
            "visionScore": {
                "avg": calculateStatsForUTILITYLane(collection).next()["avgVisionScore"],
                "stdDev": calculateStatsForUTILITYLane(collection).next()["stdDevVisionScore"]
            },
            "totalDamageTaken": {
                "avg": calculateStatsForUTILITYLane(collection).next()["avgTotalDamageTaken"],
                "stdDev": calculateStatsForUTILITYLane(collection).next()["stdDevTotalDamageTaken"]
            },
            "totalDamageDealtToChampions": {
                "avg": calculateStatsForUTILITYLane(collection).next()["avgTotalDamageDealtToChampions"],
                "stdDev": calculateStatsForUTILITYLane(collection).next()["stdDevTotalDamageDealtToChampions"]
            },
            "totalTimeCCDealt": {
                "avg": calculateStatsForUTILITYLane(collection).next()["avgTotalTimeCCDealt"],
                "stdDev": calculateStatsForUTILITYLane(collection).next()["stdDevTotalTimeCCDealt"]
            },
            "impactScore": {
                "avg": calculateStatsForUTILITYLane(collection).next()["avgImpactScore"],
                "stdDev": calculateStatsForUTILITYLane(collection).next()["stdDevImpactScore"]
            }
        }
    }