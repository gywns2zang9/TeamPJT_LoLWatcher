package com.lolwatcher.event.dto.match.info.participant;

import com.lolwatcher.event.dto.match.info.participant.perk.PerksDto;

import java.util.Map;

public record ParticipantDto(int allInPings,
                             int assistMePings,
                             int commandPings,
                             int enemyMissingPings,
                             int enemyVisionPings,
                             int holdPings,
                             int getBackPings,
                             int needVisionPings,
                             int onMyWayPings,
                             int pushPings,
                             int visionClearedPings,

                             int teamId,
                             String teamPosition,
                             String lane,
                             String individualPosition,
                             String role,

                             int kills,
                             int assists,
                             int deaths,

                             int firstBloodAssist,
                             int firstBloodKill,
                             int doubleKills,
                             int tripleKills,
                             int quadraKills,
                             int pentaKills,
                             int killingSprees,
                             int largestKillingSpree,
                             int largestMultiKill,
                             int unrealKills,

                             int firstTowerAssist,
                             int firstTowerKill,
                             int turretKills,
                             int turretTakedowns,
                             int inhibitorKills,
                             int inhibitorTakedowns,
                             int nexusKills,
                             int nexusTakesdowns,

                             int turretLost,
                             int inhibitorLost,
                             int nexusLost,

                             int dragonKills,
                             int baronKills,
                             int objectivesStolen,
                             int objectivesStolenAssists,

                             int neutralMinionsKilled,
                             int totalAllyJungleMinionsKilled,
                             int totalEnemyJungleMinionsKilled,
                             int totalMinionsKilled,

                             int bountyLevel,

                             int champExperience,
                             int champLevel,
                             int championId,
                             String championName,
                             int championTransform,

                             int goldEarned,
                             int goldSpent,
                             int item0,
                             int item1,
                             int item2,
                             int item3,
                             int item4,
                             int item5,
                             int item6,
                             int itemPurchased,

                             int consumablesPurchased,

                             int sightWardsBoughtInGame,
                             int detectorWardsPlaces,
                             int visionScore,
                             int visionWardsBoughtInGame,
                             int wardsKill,
                             int wardsPlaced,

                             Map<String, Object> challenges,
                             MissionsDto missions,
                             PerksDto perks,

                             int damageDealtToBuildings,
                             int damageDealtToObjectives,
                             int damageDealtToTurrets,
                             int damageSelfMitigated,
                             int largestCriticalStrike,

                             int physicalDamageDealt,
                             int physicalDamageDealtToChampions,
                             int physicalDamageTaken,

                             int magicDamageDealt,
                             int magicDamageDealtToChampions,
                             int magicDamageTaken,

                             int trueDamageDealt,
                             int trueDamageDealtToChampions,
                             int trueDamageTaken,

                             int totalDamageDealt,
                             int totalDamageDealtToChampions,
                             int totalDamageTaken,

                             int timeCCingOthers,
                             int totalDamageShieldedOnTeammates,
                             int totalHeal,
                             int totalHealsOnTeammates,
                             int totalUnitsHealed,

                             int spell1Casts,
                             int spell2Casts,
                             int spell3Casts,
                             int spell4Casts,
                             int summoner1Casts,
                             int summoner1Id,
                             int summoner2Casts,
                             int summoner2Id,

                             int longestTimeSpentLiving,
                             int totalTimeSpentDead,

                             int timePlayed,

                             int playerSubteamId,

                             boolean eligibleForProgression, // 승급전 여부
                             boolean gameEndedInEarlySurrender, //
                             boolean gameEndedInSurrender,
                             boolean teamEarlySurrendered,
                             boolean win,

                             int participantId,
                             String riotIdGameName,
                             String riotIdTagline,
                             int profileIcon,
                             String puuid,
                             String summonerId,
                             int summonerLevel,
                             String summonerName,

                             int playerScore0, int playerScore1, int playerScore2, int playerScore3,
                             int playerScore4, int playerScore5, int playerScore6, int playerScore7,
                             int playerScore8, int playerScore9, int playerScore10,

                             int placement,
                             int subteamPlacement,

                             int playerAugment1, int playerAugment2, int playerAugment3, int playerAugment4



                             ) {
}

/*
challenges Map<String, Object>
12AssistStreakCount	int
baronBuffGoldAdvantageOverThreshold	int
controlWardTimeCoverageInRiverOrEnemyHalf	float
earliestBaron	int
earliestDragonTakedown	int
earliestElderDragon	int
earlyLaningPhaseGoldExpAdvantage	int
fasterSupportQuestCompletion	int
fastestLegendary	int
hadAfkTeammate	int
highestChampionDamage	int
highestCrowdControlScore	int
highestWardKills	int
junglerKillsEarlyJungle	int
killsOnLanersEarlyJungleAsJungler	int
laningPhaseGoldExpAdvantage	int
legendaryCount	int
maxCsAdvantageOnLaneOpponent	float
maxLevelLeadLaneOpponent	int
mostWardsDestroyedOneSweeper	int
mythicItemUsed	int
playedChampSelectPosition	int
soloTurretsLategame	int
takedownsFirst25Minutes	int
teleportTakedowns	int
thirdInhibitorDestroyedTime	int
threeWardsOneSweeperCount	int
visionScoreAdvantageLaneOpponent	float
InfernalScalePickup	int
fistBumpParticipation	int
voidMonsterKill	int
abilityUses	int
acesBefore15Minutes	int
alliedJungleMonsterKills	float
baronTakedowns	int
blastConeOppositeOpponentCount	int
bountyGold	int
buffsStolen	int
completeSupportQuestInTime	int
controlWardsPlaced	int
damagePerMinute	float
damageTakenOnTeamPercentage	float
dancedWithRiftHerald	int
deathsByEnemyChamps	int
dodgeSkillShotsSmallWindow	int
doubleAces	int
dragonTakedowns	int
legendaryItemUsed	List[int]
effectiveHealAndShielding	float
elderDragonKillsWithOpposingSoul	int
elderDragonMultikills	int
enemyChampionImmobilizations	int
enemyJungleMonsterKills	float
epicMonsterKillsNearEnemyJungler	int
epicMonsterKillsWithin30SecondsOfSpawn	int
epicMonsterSteals	int
epicMonsterStolenWithoutSmite	int
firstTurretKilled	int
firstTurretKilledTime	float
flawlessAces	int
fullTeamTakedown	int
gameLength	float
getTakedownsInAllLanesEarlyJungleAsLaner	int
goldPerMinute	float
hadOpenNexus	int
immobilizeAndKillWithAlly	int
initialBuffCount	int
initialCrabCount	int
jungleCsBefore10Minutes	float
junglerTakedownsNearDamagedEpicMonster	int
kda	float
killAfterHiddenWithAlly	int
killedChampTookFullTeamDamageSurvived	int
killingSprees	int
killParticipation	float
killsNearEnemyTurret	int
killsOnOtherLanesEarlyJungleAsLaner	int
killsOnRecentlyHealedByAramPack	int
killsUnderOwnTurret	int
killsWithHelpFromEpicMonster	int
knockEnemyIntoTeamAndKill	int
kTurretsDestroyedBeforePlatesFall	int
landSkillShotsEarlyGame	int
laneMinionsFirst10Minutes	int
lostAnInhibitor	int
maxKillDeficit	int
mejaisFullStackInTime	int
moreEnemyJungleThanOpponent	float
multiKillOneSpell	int
multikills	int
multikillsAfterAggressiveFlash	int
multiTurretRiftHeraldCount	int
outerTurretExecutesBefore10Minutes	int
outnumberedKills	int
outnumberedNexusKill	int
perfectDragonSoulsTaken	int
perfectGame	int
pickKillWithAlly	int
poroExplosions	int
quickCleanse	int
quickFirstTurret	int
quickSoloKills	int
riftHeraldTakedowns	int
saveAllyFromDeath	int
scuttleCrabKills	int
shortestTimeToAceFromFirstTakedown	float
skillshotsDodged	int
skillshotsHit	int
snowballsHit	int
soloBaronKills	int
SWARM_DefeatAatrox	int
SWARM_DefeatBriar	int
SWARM_DefeatMiniBosses	int
SWARM_EvolveWeapon	int
SWARM_Have3Passives	int
SWARM_KillEnemy	int
SWARM_PickupGold	float
SWARM_ReachLevel50	int
SWARM_Survive15Min	int
SWARM_WinWith5EvolvedWeapons	int
soloKills	int
stealthWardsPlaced	int
survivedSingleDigitHpCount	int
survivedThreeImmobilizesInFight	int
takedownOnFirstTurret	int
takedowns	int
takedownsAfterGainingLevelAdvantage	int
takedownsBeforeJungleMinionSpawn	int
takedownsFirstXMinutes	int
takedownsInAlcove	int
takedownsInEnemyFountain	int
teamBaronKills	int
teamDamagePercentage	float
teamElderDragonKills	int
teamRiftHeraldKills	int
tookLargeDamageSurvived	int
turretPlatesTaken	int
turretsTakenWithRiftHerald	int
turretTakedowns	int
twentyMinionsIn3SecondsCount	int
twoWardsOneSweeperCount	int
unseenRecalls	int
visionScorePerMinute	float
wardsGuarded	int
wardTakedowns	int
wardTakedownsBefore20M	int
 */
