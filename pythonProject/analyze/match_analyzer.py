def calculateStatsForTopLane(collection):
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
                "visionScore": "$matchDto.info.participants.challenges.visionScore",
                "goldPerMinute": "$matchDto.info.participants.challenges.goldPerMinute",
                "totalDamageDealtToChampions": "$matchDto.info.participants.totalDamageDealtToChampions",
                # impactScore 공통적으로 들어가는 영향도
                "impactScore": {
                    "$add": [
                        {"$multiply": ["$matchDto.info.participants.challenges.killParticipation", 0.2]},
                        {"$multiply": ["$matchDto.info.participants.challenges.kda", 0.1]},
                        {"$multiply": [{"$add": ["$matchDto.info.participants.challenges.dragonTakedowns",
                                                 "$matchDto.info.participants.challenges.baronTakedowns",
                                                 "$matchDto.info.participants.challenges.riftHeraldTakedowns",
                                                 ]}, 0.2]},
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

def calculateStatsForJUNGLELane(collection):
    return collection.aggregate([
        {
            "$unwind": "$matchDto.info.participants"
        },
        {
            "$match": {
                "matchDto.info.participants.teamPosition": "JUNGLE"
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

def calculateStatsForMIDLane(collection):
    return collection.aggregate([
        {
            "$unwind": "$matchDto.info.participants"
        },
        {
            "$match": {
                "matchDto.info.participants.teamPosition": "MID"
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

def calculateStatsForUTILITYLane(collection):
    return collection.aggregate([
        {
            "$unwind": "$matchDto.info.participants"
        },
        {
            "$match": {
                "matchDto.info.participants.teamPosition": "UTILITY"
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

def calculateStatsForBOTTOMLane(collection):
    return collection.aggregate([
        {
            "$unwind": "$matchDto.info.participants"
        },
        {
            "$match": {
                "matchDto.info.participants.teamPosition": "BOTTOM"
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