package com.collect.data.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ChampionStatistics {
    private final int championId;

    // 전체 플레이된 게임 수
    private long totalGamesPlayed;

    // 총 승리한 게임 수
    // 승리 횟수는 matchDto.info.teams에서 teamId와 win 값을 매칭해 계산
    private long totalWins;

    // 총 밴된 횟수
    // 밴 횟수는 matchDto.info.teams.bans에서 championId로 계산
    private long totalBans;

    // 총 픽된 횟수
    // 챔피언이 플레이된 횟수
    private long totalPicks;

    // 평균 분당 가한 데미지 (DPM)
    // totalDamageDealtToChampions / gameDuration * 60
    private double avgDPM;

    // 평균 분당 받은 데미지 (TDM)
    // totalDamageTaken / gameDuration * 60
    private double avgTDM;

    // 성장은 골드 소비량 대비 딜량
    // goldEarned와 damageDealtToChampions 간의 비율을 통해 계산
    private double avgGrowth;

    // 총 학살 횟수 (Carnage)
    // 총 킬 수(matchDto.info.participants.kills의 합계)
    private double totalCarnage;

    // 총 어시스트 횟수 (Support)
    // matchDto.info.participants.assists의 합계
    private double totalSupport;

    // 평균 분당 시야 점수 (Clairvoyance)
    // visionScore / gameDuration * 60
    private double avgClairvoyance;

    // 오브젝트 처치 수 (Dominance)
    // matchDto.info.participants.objectivesTaken의 평균
    private long avgDominance;

    // 총 실드와 회복량 (Salvation)
    // totalDamageShieldedOnTeammates + totalHealsOnTeammates
    private long avgSalvation;

    // 평균 분당 회피 수 (Evasion)
    // challenges.skillshotsDodged / gameDuration * 60
    private double totalEvasion;

    // 평균 KDA (킬/데스/어시스트 비율)
    // (kills + assists) / deaths (deaths가 0일 경우, 1로 나눔)
    private double avgKDA;

    // 승률 (Win Rate)
    // totalWins / totalPicks * 100
    private double winRate;

    // 밴률 (Ban Rate)
    // totalBans / totalGamesPlayed * 100
    private double banRate;

    // 픽률 (Pick Rate)
    // totalPicks / totalGamesPlayed * 100
    private double pickRate;

}