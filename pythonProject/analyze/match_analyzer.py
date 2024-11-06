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
                "_id": 0,
                "soloKills": "$matchDto.info.participants.challenges.soloKills",
                "turretTakedowns": "$matchDto.info.participants.turretTakedowns",
                "totalDamageTaken": "$matchDto.info.participants.totalDamageTaken",
                "killParticipation": "$matchDto.info.participants.challenges.killParticipation",
                # impactScore 공통적으로 들어가는 영향도
                "impactScore": {
                    "$add": [
                        {"$multiply": ["$matchDto.info.participants.challenges.killParticipation", 0.2]},
                        {"$multiply": ["$matchDto.info.participants.challenges.kda", 0.1]},
                        {"$multiply": [{"$add": ["$matchDto.info.participants.challenges.dragonTakedowns",
                                                 "$matchDto.info.participants.challenges.baronTakedowns",
                                                 "$matchDto.info.participants.challenges.riftHeraldTakedowns",
                                                 ]}, 0.2]},
                        {"$multiply": ["$matchDto.info.participants.visionScore", 0.2]},
                        {"$multiply": ["$matchDto.info.participants.challenges.goldPerMinute", 0.1]},
                        {"$multiply": ["$matchDto.info.participants.turretTakedowns", 0.1]},
                        {"$multiply": ["$matchDto.info.participants.totalDamageDealtToChampions", 0.1]}
                    ]
                }
            }
        },
        {
            "$group": {
                "_id": "Top",
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
                "_id": 0,
                "objectTakedowns": {
                    "$add": [
                        "$matchDto.info.participants.challenges.dragonTakedowns",
                        "$matchDto.info.participants.challenges.baronTakedowns",
                        "$matchDto.info.participants.challenges.riftHeraldTakedowns"
                    ]
                },
                "turretTakedowns": "$matchDto.info.participants.turretTakedowns",
                "visionScore": "$matchDto.info.participants.visionScore",
                "lineImpact": {
                    "$add": [
                        "$matchDto.info.participants.challenges.takedownsFirstXMinutes",
                        "$matchDto.info.participants.challenges.earlyLaningPhaseGoldExpAdvantage",
                        "$matchDto.info.participants.challenges.laningPhaseGoldExpAdvantage"
                    ]
                },
                # impactScore 계산을 위해 필요한 요소들
                "impactScore": {
                    "$add": [
                        {"$multiply": ["$matchDto.info.participants.challenges.killParticipation", 0.2]},
                        {"$multiply": ["$matchDto.info.participants.challenges.kda", 0.1]},
                        {"$multiply": [{"$add": ["$matchDto.info.participants.challenges.dragonTakedowns",
                                                 "$matchDto.info.participants.challenges.baronTakedowns",
                                                 "$matchDto.info.participants.challenges.riftHeraldTakedowns",
                                                 ]}, 0.2]},
                        {"$multiply": ["$matchDto.info.participants.visionScore", 0.2]},
                        {"$multiply": ["$matchDto.info.participants.challenges.goldPerMinute", 0.1]},
                        {"$multiply": ["$matchDto.info.participants.turretTakedowns", 0.1]},
                        {"$multiply": ["$matchDto.info.participants.totalDamageDealtToChampions", 0.1]}
                    ]
                }
            }
        },
        {
            "$group": {
                "_id": "Jungle",
                "avgObjectTakedowns": {"$avg": "$objectTakedowns"},
                "stdDevObjectTakedowns": {"$stdDevPop": "$objectTakedowns"},

                "avgTurretTakedowns": {"$avg": "$turretTakedowns"},
                "stdDevTurretTakedowns": {"$stdDevPop": "$turretTakedowns"},

                "avgVisionScore": {"$avg": "$visionScore"},
                "stdDevVisionScore": {"$stdDevPop": "$visionScore"},

                "avgLineImpact": {"$avg": "$lineImpact"},
                "stdDevLineImpact": {"$stdDevPop": "$lineImpact"},

                "avgImpactScore": {"$avg": "$impactScore"},
                "stdDevImpactScore": {"$stdDevPop": "$impactScore"}
            }
        },
        {
            "$project": {
                "_id": 0,
                "avgObjectTakedowns": 1,
                "stdDevObjectTakedowns": 1,

                "avgTurretTakedowns": 1,
                "stdDevTurretTakedowns": 1,

                "avgVisionScore": 1,
                "stdDevVisionScore": 1,

                "avgLineImpact": 1,
                "stdDevLineImpact": 1,

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
                "matchDto.info.participants.teamPosition": "MIDDLE"
            }
        },
        {
            "$project": {
                "_id": 0,
                "killParticipation": "$matchDto.info.participants.challenges.killParticipation",
                "turretTakedowns": "$matchDto.info.participants.turretTakedowns",
                "totalDamageDealtToChampions": "$matchDto.info.participants.totalDamageDealtToChampions",
                "objectTakedowns": {
                    "$add": [
                        "$matchDto.info.participants.challenges.dragonTakedowns",
                        "$matchDto.info.participants.challenges.baronTakedowns",
                        "$matchDto.info.participants.challenges.riftHeraldTakedowns"
                    ]
                },
                # impactScore 계산을 위해 필요한 요소들
                "impactScore": {
                    "$add": [
                        {"$multiply": ["$matchDto.info.participants.challenges.killParticipation", 0.2]},
                        {"$multiply": ["$matchDto.info.participants.challenges.kda", 0.1]},
                        {"$multiply": [{"$add": ["$matchDto.info.participants.challenges.dragonTakedowns",
                                                 "$matchDto.info.participants.challenges.baronTakedowns",
                                                 "$matchDto.info.participants.challenges.riftHeraldTakedowns",
                                                 ]}, 0.2]},
                        {"$multiply": ["$matchDto.info.participants.visionScore", 0.2]},
                        {"$multiply": ["$matchDto.info.participants.challenges.goldPerMinute", 0.1]},
                        {"$multiply": ["$matchDto.info.participants.turretTakedowns", 0.1]},
                        {"$multiply": ["$matchDto.info.participants.totalDamageDealtToChampions", 0.1]}
                    ]
                }
            }
        },
        {
            "$group": {
                "_id": "Middle",

                "avgKillParticipation": {"$avg": "$killParticipation"},
                "stdDevKillParticipation": {"$stdDevPop": "$killParticipation"},

                "avgTurretTakedowns": {"$avg": "$turretTakedowns"},
                "stdDevTurretTakedowns": {"$stdDevPop": "$turretTakedowns"},

                "avgTotalDamageDealtToChampions": {"$avg": "$totalDamageDealtToChampions"},
                "stdDevTotalDamageDealtToChampions": {"$stdDevPop": "$totalDamageDealtToChampions"},

                "avgObjectTakedowns": {"$avg": "$objectTakedowns"},
                "stdDevObjectTakedowns": {"$stdDevPop": "$objectTakedowns"},

                "avgImpactScore": {"$avg": "$impactScore"},
                "stdDevImpactScore": {"$stdDevPop": "$impactScore"}
            }
        },
        {
            "$project": {
                "_id": 0,

                "avgKillParticipation": 1,
                "stdDevKillParticipation": 1,

                "avgTurretTakedowns": 1,
                "stdDevTurretTakedowns": 1,

                "avgTotalDamageDealtToChampions": 1,
                "stdDevTotalDamageDealtToChampions": 1,

                "avgObjectTakedowns": 1,
                "stdDevObjectTakedowns": 1,

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
                "_id": 0,
                "totalDamageDealtToChampions": "$matchDto.info.participants.totalDamageDealtToChampions",
                "totalMinionsKilled":"$matchDto.info.participants.totalMinionsKilled",
                "deaths":"$matchDto.info.participants.deaths",
                "skillshotsDodged":"$matchDto.info.participants.challenges.skillshotsDodged",
                # impactScore 계산을 위해 필요한 요소들
                "impactScore": {
                    "$add": [
                        {"$multiply": ["$matchDto.info.participants.challenges.killParticipation", 0.2]},
                        {"$multiply": ["$matchDto.info.participants.challenges.kda", 0.1]},
                        {"$multiply": [{"$add": ["$matchDto.info.participants.challenges.dragonTakedowns",
                                                 "$matchDto.info.participants.challenges.baronTakedowns",
                                                 "$matchDto.info.participants.challenges.riftHeraldTakedowns",
                                                 ]}, 0.2]},
                        {"$multiply": ["$matchDto.info.participants.visionScore", 0.2]},
                        {"$multiply": ["$matchDto.info.participants.challenges.goldPerMinute", 0.1]},
                        {"$multiply": ["$matchDto.info.participants.turretTakedowns", 0.1]},
                        {"$multiply": ["$matchDto.info.participants.totalDamageDealtToChampions", 0.1]}
                    ]
                }
            }
        },
        {
            "$group": {
                "_id": "Bottom",

                "avgTotalDamageDealtToChampions": {"$avg": "$totalDamageDealtToChampions"},
                "stdDevTotalDamageDealtToChampions": {"$stdDevPop": "$totalDamageDealtToChampions"},

                "avgTotalMinionsKilled": {"$avg": "$totalMinionsKilled"},
                "stdDevTotalMinionsKilled": {"$stdDevPop": "$totalMinionsKilled"},

                "avgDeaths": {"$avg": "$deaths"},
                "stdDevDeaths": {"$stdDevPop": "$deaths"},

                "avgSkillshotsDodged": {"$avg": "$skillshotsDodged"},
                "stdDevSkillshotsDodged": {"$stdDevPop": "$skillshotsDodged"},

                "avgImpactScore": {"$avg": "$impactScore"},
                "stdDevImpactScore": {"$stdDevPop": "$impactScore"}
            }
        },
        {
            "$project": {
                "_id": 0,

                "avgTotalDamageDealtToChampions": 1,
                "stdDevTotalDamageDealtToChampions": 1,

                "avgTotalMinionsKilled": 1,
                "stdDevTotalMinionsKilled": 1,

                "avgDeaths": 1,
                "stdDevDeaths": 1,

                "avgSkillshotsDodged": 1,
                "stdDevSkillshotsDodged": 1,

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
                "_id": 0,
                "visionScore": "$matchDto.info.participants.visionScore",
                "totalDamageTaken": "$matchDto.info.participants.totalDamageTaken",
                "totalDamageDealtToChampions": "$matchDto.info.participants.totalDamageDealtToChampions",
                "totalTimeCCDealt":"$matchDto.info.participants.totalTimeCCDealt",
                # impactScore 계산을 위해 필요한 요소들
                "impactScore": {
                    "$add": [
                        {"$multiply": ["$matchDto.info.participants.challenges.killParticipation", 0.2]},
                        {"$multiply": ["$matchDto.info.participants.challenges.kda", 0.1]},
                        {"$multiply": [{"$add": ["$matchDto.info.participants.challenges.dragonTakedowns",
                                                 "$matchDto.info.participants.challenges.baronTakedowns",
                                                 "$matchDto.info.participants.challenges.riftHeraldTakedowns",
                                                 ]}, 0.2]},
                        {"$multiply": ["$matchDto.info.participants.visionScore", 0.2]},
                        {"$multiply": ["$matchDto.info.participants.challenges.goldPerMinute", 0.1]},
                        {"$multiply": ["$matchDto.info.participants.turretTakedowns", 0.1]},
                        {"$multiply": ["$matchDto.info.participants.totalDamageDealtToChampions", 0.1]}
                    ]
                }
            }
        },
        {
             "$group": {
                "_id": "Utility",

                "avgVisionScore": {"$avg": "$visionScore"},
                "stdDevVisionScore": {"$stdDevPop": "$visionScore"},

                "avgTotalDamageTaken": {"$avg": "$totalDamageTaken"},
                "stdDevTotalDamageTaken": {"$stdDevPop": "$totalDamageTaken"},

                "avgTotalDamageDealtToChampions": {"$avg": "$totalDamageDealtToChampions"},
                "stdDevTotalDamageDealtToChampions": {"$stdDevPop": "$totalDamageDealtToChampions"},

                "avgTotalTimeCCDealt": {"$avg": "$totalTimeCCDealt"},
                "stdDevTotalTimeCCDealt": {"$stdDevPop": "$totalTimeCCDealt"},

                "avgImpactScore": {"$avg": "$impactScore"},
                "stdDevImpactScore": {"$stdDevPop": "$impactScore"}
             }
        },
        {
            "$project": {
                "_id": 0,

                "avgVisionScore": 1,
                "stdDevVisionScore": 1,

                "avgTotalDamageTaken": 1,
                "stdDevTotalDamageTaken": 1,

                "avgTotalDamageDealtToChampions": 1,
                "stdDevTotalDamageDealtToChampions": 1,

                "avgTotalTimeCCDealt": 1,
                "stdDevTotalTimeCCDealt": 1,

                "avgImpactScore": 1,
                "stdDevImpactScore": 1
            }
        }
    ])

