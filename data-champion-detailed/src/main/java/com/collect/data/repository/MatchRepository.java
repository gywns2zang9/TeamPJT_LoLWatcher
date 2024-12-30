package com.collect.data.repository;

import com.collect.data.document.Match;
import com.collect.data.dto.ChampionStatistics;
import lombok.RequiredArgsConstructor;
import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.*;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Component;

import java.util.*;

import static org.springframework.data.mongodb.core.aggregation.Aggregation.*;

@Component
@RequiredArgsConstructor
public class MatchRepository {

    private final MongoTemplate mongoTemplate;

    // 기본 CRUD 작업 메서드
    public boolean exists(String id, String collectionName) {
        Query query = new Query();
        query.addCriteria(Criteria.where("_id").is(id));
        return mongoTemplate.exists(query, collectionName);
    }

    public void save(Match match, String collectionName) {
        mongoTemplate.save(match, collectionName);
    }

    public void save(Map<String, List<ChampionStatistics>> statistics) {
        mongoTemplate.save(statistics, "analytics");
    }

    public long count(String collectionName) {
        return mongoTemplate.count(new Query(), collectionName);
    }

    public List<ChampionStatistics> calculateChampionDetailedStats(String collectionName) {

        Aggregation matchCountAggregation = newAggregation(
                group().count().as("totalMatches")
        );

        AggregationResults<Document> matchCountResults = mongoTemplate.aggregate(matchCountAggregation, collectionName, Document.class);
        Document matchCountResult = matchCountResults.getUniqueMappedResult();

        if (matchCountResult == null) {
            System.out.println("No matches found in collection: " + collectionName);
            return new ArrayList<>();
        }

        Number totalMatchesNumber = matchCountResult.get("totalMatches", Number.class);
        long totalMatches = totalMatchesNumber.longValue();
        System.out.println("Total Matches: " + totalMatches);

        Aggregation banAggregation = newAggregation(
                unwind("matchDto.info.teams"),
                unwind("matchDto.info.teams.bans", true),
                group("matchDto.info.teams.bans.championId")
                        .count().as("totalBans"),
                project("totalBans")
                        .and("_id").as("championId")
                        .andExclude("_id")
        );

        AggregationResults<Document> banResults = mongoTemplate.aggregate(banAggregation, collectionName, Document.class);
        Map<Integer, Long> banCountMap = new HashMap<>();

        for (Document result : banResults) {
            int championId = result.getInteger("championId");
            long totalBans = result.get("totalBans", Number.class).longValue();
            banCountMap.put(championId, totalBans);
        }


        Aggregation aggregation = newAggregation(
                unwind("matchDto.info.participants"),
                group("matchDto.info.participants.championId")
                        .count().as("totalPicks") // 해당 챔피언의 픽 횟수
                        .sum(ConditionalOperators.when(Criteria.where("matchDto.info.participants.win").is(true)).then(1).otherwise(0)).as("totalWins")
                        .avg(ConditionalOperators.when(Criteria.where("matchDto.info.gameDuration").ne(0))
                                .then(ArithmeticOperators.Divide.valueOf(
                                        ConditionalOperators.ifNull("matchDto.info.participants.totalDamageDealtToChampions").then(0)
                                ).divideBy("matchDto.info.gameDuration"))
                                .otherwise(0)
                        ).as("avgDPM")
                        .avg(ConditionalOperators.when(Criteria.where("matchDto.info.gameDuration").ne(0))
                                .then(ArithmeticOperators.Divide.valueOf(
                                        ConditionalOperators.ifNull("matchDto.info.participants.totalDamageTaken").then(0)
                                ).divideBy("matchDto.info.gameDuration"))
                                .otherwise(0)
                        ).as("avgTDM")
                        .avg("matchDto.info.participants.challenges.goldPerMinute").as("avgGrowth") // Gold Per Minute 사용
                        .avg("matchDto.info.participants.kills").as("totalCarnage") // 총 킬 수 (학살)
                        .avg("matchDto.info.participants.assists").as("totalSupport") // 총 어시스트 횟수
                        .avg(ConditionalOperators.when(Criteria.where("matchDto.info.gameDuration").ne(0))
                                .then(ArithmeticOperators.Divide.valueOf(
                                        ConditionalOperators.ifNull("matchDto.info.participants.visionScore").then(0)
                                ).divideBy("matchDto.info.gameDuration"))
                                .otherwise(0)
                        ).as("avgClairvoyance")
                        .sum("matchDto.info.participants.objectivesTaken").as("avgDominance") // 오브젝트 처치 수 (지배)
                        .sum(ArithmeticOperators.Add.valueOf(
                                ConditionalOperators.ifNull("matchDto.info.participants.totalDamageShieldedOnTeammates").then(0)
                        ).add(
                                ConditionalOperators.ifNull("matchDto.info.participants.totalHealsOnTeammates").then(0)
                        )).as("avgSalvation") // 총 실드와 회복량 (구원)
                        .avg("matchDto.info.participants.challenges.kda").as("avgKDA") // 제공된 KDA 값 사용
                        .avg(ConditionalOperators.ifNull("matchDto.info.participants.challenges.skillshotsDodged").then(0)).as("totalEvasion"), // 시간으로 나누지 않고 총 회피 수 합산
                project("totalPicks", "totalWins", "totalBans", "avgDPM", "avgTDM", "avgGrowth", "totalCarnage", "totalSupport", "avgClairvoyance", "avgDominance", "avgSalvation", "avgKDA", "totalEvasion")
                        .and("_id").as("championId")
                        .andExclude("_id")
        );

        AggregationResults<Document> results = mongoTemplate.aggregate(aggregation, collectionName, Document.class);
        List<Document> statsResults = results.getMappedResults();

        List<ChampionStatistics> championStatisticsList = new ArrayList<>();

        for (Document result : statsResults) {
            int championId = result.getInteger("championId");
            long totalPicks = result.get("totalPicks", Number.class).longValue();
            long totalWins = result.get("totalWins", Number.class).longValue();
            long totalBans = banCountMap.getOrDefault(championId, 0L);

            double pickRate = totalMatches > 0 ? ((double) totalPicks / totalMatches) * 100 : 0;
            double winRate = totalPicks > 0 ? ((double) totalWins / totalPicks) * 100 : 0;
            double banRate = totalMatches > 0 ? ((double) totalBans / totalMatches) * 100 : 0;

            double avgDPM = result.get("avgDPM", Number.class).doubleValue() * 60;
            double avgTDM = result.get("avgTDM", Number.class).doubleValue() * 60;
            double avgGrowth = result.get("avgGrowth", Number.class).doubleValue(); // 제공된 GoldPerMinute 사용 (이미 분당 계산된 값)
            double totalCarnage = result.get("totalCarnage", Number.class).doubleValue();
            double totalSupport = result.get("totalSupport", Number.class).doubleValue();
            double avgClairvoyance = result.get("avgClairvoyance", Number.class).doubleValue() * 60;
            long avgDominance = result.get("avgDominance", Number.class).longValue();
            long avgSalvation = result.get("avgSalvation", Number.class).longValue();
            double totalEvasion = result.get("totalEvasion", Number.class).doubleValue(); // 시간으로 나누지 않은 총 스킬 회피 수
            double avgKDA = result.get("avgKDA", Number.class).doubleValue();

            ChampionStatistics championStatistics = new ChampionStatistics(
                    championId,
                    totalMatches,
                    totalWins,
                    totalBans,
                    totalPicks,
                    avgDPM,
                    avgTDM,
                    avgGrowth,
                    totalCarnage,
                    totalSupport,
                    avgClairvoyance,
                    avgDominance,
                    avgSalvation,
                    totalEvasion,
                    avgKDA,
                    winRate,
                    banRate,
                    pickRate
            );
            championStatisticsList.add(championStatistics);
        }

        return championStatisticsList;
    }
}
