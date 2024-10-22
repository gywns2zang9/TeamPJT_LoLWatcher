package com.lolwatcher.event.dto;

import java.util.List;

public class MatchParticipant {
    private int allInPings;
    private int assistMePings;
    private int assists;
    private int baronKills;
    private int basicPings;
    private int bountyLevel;
    private MatchChallenges challenges; // 도전 과제 데이터를 담는 클래스
    private int deathsByEnemyChamps;
    private String championName;
    private int championId;
    private int championTransform;
    private String individualPosition;
    private long totalDamageDealt;
    private long totalDamageTaken;
    private int kills;
    private String summonerName;
    private String summonerId;
    private int summonerLevel;
    private boolean win;
    private int goldEarned;
    private int goldSpent;
    private int inhibitorKills;
    private int inhibitorTakedowns;
    private List<Integer> legendaryItemUsed;
    private int longestTimeSpentLiving;
    private String role;
    private List<Integer> itemsPurchased;
    private int doubleKills;
    private int tripleKills;
    private int quadraKills;
    private int pentaKills;
    private int totalTimeSpentDead;
    private int killsUnderOwnTurret;
    private int killsNearEnemyTurret;
    private int totalUnitsHealed;
    private int totalHeal;
    private int totalDamageDealtToChampions;
    private int totalDamageShieldedOnTeammates;
    private int damageDealtToBuildings;
    private int damageDealtToObjectives;
    private int turretTakedowns;
    private int turretKills;
    private int wardsPlaced;
    private int wardsKilled;
    private int visionScore;
    private MatchPerks perks;  // 퍼크 데이터는 Perks 클래스로 처리
    private List<Integer> summonerSpells; // 소환사 주문 리스트 (ex: spell1, spell2)
    private int timeCCingOthers;
    private int timePlayed;
    private int level;
    private int placement;
    private int nexusKills;
    private int nexusTakedowns;
    private int snowballsHit;
    private int neutralMinionsKilled;
    private int laneMinionsFirst10Minutes;
    private int minionsKilled;
    private List<Integer> playerAugments;
    private int jungleCsBefore10Minutes;
    private boolean eligibleForProgression;
    private String puuid;
}
