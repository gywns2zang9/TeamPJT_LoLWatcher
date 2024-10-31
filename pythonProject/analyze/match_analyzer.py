def analyze_participants(data):

    for i,participant in enumerate(data['info']['participants']):

        if i % 5 == 0:
            print(
                f"Participant {i} teamPosition: {participant['teamPosition']} "
                f"soloKills: {participant['challenges']['soloKills']} "
                f"quickSoloKills: {participant['challenges']['quickSoloKills']} "
                f"towerTakedowns: {participant['turretTakedowns']} "
                f"damageTaken: {participant['totalDamageTaken']} "
                f"killParticipation: {participant['challenges']['killParticipation']} "
                f"deaths: {participant['deaths']} "
                f"damageDealtToChampions: {participant['totalDamageDealtToChampions']} "
                f"riftHeraldTakedowns: {participant['challenges']['riftHeraldTakedowns']}"
            )
        elif i % 5 == 1:
            total_objective_score = (
                participant['challenges']['dragonTakedowns'] +
                participant['challenges']['baronTakedowns'] +
                participant['challenges']['scuttleCrabKills'] +
                participant['challenges']['buffsStolen']
            )
            print(
                f"Participant {i} teamPosition: {participant['teamPosition']} "
                f"totalObjectiveScore: {total_objective_score} "
                f"towerTakedowns: {participant['turretTakedowns']} "
                f"damageDealtToChampions: {participant['totalDamageDealtToChampions']} "
                f"damageTaken: {participant['totalDamageTaken']} "
                f"visionScore: {participant['visionScore']}"
            )
        elif i % 5 == 2:
            rift_and_dragon_contributions = (
                participant['challenges']['riftHeraldTakedowns'] +
                participant['challenges']['dragonTakedowns']
            )
            print(
                f"Participant {i} teamPosition: {participant['teamPosition']} "
                f"killParticipation: {participant['challenges']['killParticipation']} "
                f"towerTakedowns: {participant['turretTakedowns']} "
                f"damageDealtToChampions: {participant['totalDamageDealtToChampions']} "
                f"damageTaken: {participant['totalDamageTaken']} "
                f"riftAndDragonContributions: {rift_and_dragon_contributions}"
            )
        elif i % 5 == 3:
            print(
                f"Participant {i} teamPosition: {participant['teamPosition']} "
                f"damageDealtToChampions: {participant['totalDamageDealtToChampions']} "
                f"totalMinionsKilled (CS): {participant['totalMinionsKilled']} "
                f"deaths: {participant['deaths']} "
                f"finalGold: {participant['goldEarned']} "
                f"towerTakedowns: {participant['turretTakedowns']} "
                f"dragonTakedowns: {participant['challenges']['dragonTakedowns']} "
                f"skillshotsDodged: {participant['challenges']['skillshotsDodged']}"
            )
        elif i % 5 == 4:
            print(
                f"Participant {i} teamPosition: {participant['teamPosition']} "
                f"visionScore: {participant['visionScore']} "
                f"damageTaken: {participant['totalDamageTaken']} "
                f"timeCCingOthers (CC score): {participant['timeCCingOthers']} "
                f"totalDamageShieldedOnTeammates (Team Protection): {participant['totalDamageShieldedOnTeammates']} "
                f"damageDealtToChampions: {participant['totalDamageDealtToChampions']} "
                f"KDA: {participant['challenges']['kda']} "
                f"dragonTakedowns: {participant['challenges']['dragonTakedowns']}"
            )

        print(f"Participant Influence Score: {calculate_influence_score(participant)}"
            f"\n---------------------------------------------------------------------------------")


def calculate_influence_score(participant):
    # 각 지표에 대한 가중치를 설정 (총합이 1이 되도록 조정)
    weight_kill_participation = 0.2
    weight_total_damage = 0.15
    weight_total_damage_taken = 0.15
    weight_cs = 0.1
    weight_vision_score = 0.1
    weight_objective_score = 0.15
    weight_tower_takedowns = 0.1
    weight_team_support = 0.1

    # 각 지표의 값
    kill_participation = participant['challenges']['killParticipation']
    total_damage = participant['totalDamageDealtToChampions']
    total_damage_taken = participant['totalDamageTaken']
    cs = participant['totalMinionsKilled'] + participant['neutralMinionsKilled']
    vision_score = participant['visionScore']
    objective_score = (
        participant['challenges']['dragonTakedowns'] +
        participant['challenges']['baronTakedowns'] +
        participant['challenges']['scuttleCrabKills'] +
        participant['challenges']['buffsStolen']
    )
    tower_takedowns = participant['turretTakedowns']
    team_support = participant['totalDamageShieldedOnTeammates'] + participant['totalHealsOnTeammates']

    # 각 지표의 점수를 가중치와 함께 합산하여 최종 점수 계산
    total_score = (
        kill_participation * weight_kill_participation +
        (total_damage / 50000) * weight_total_damage +  # 50,000 기준으로 정규화
        (total_damage_taken / 50000) * weight_total_damage_taken +  # 50,000 기준으로 정규화
        (cs / 300) * weight_cs +  # 300 CS 기준으로 정규화
        (vision_score / 50) * weight_vision_score +  # 50 시야 점수 기준으로 정규화
        (objective_score / 10) * weight_objective_score +  # 10개 기준으로 정규화
        (tower_takedowns / 5) * weight_tower_takedowns +  # 5개 기준으로 정규화
        (team_support / 5000) * weight_team_support  # 5,000 보호/힐량 기준으로 정규화
    )

    # 최종 점수 (20점 만점으로 조정)
    final_score = min(total_score * 20, 20)  # 최대 20점
    return round(final_score, 2)