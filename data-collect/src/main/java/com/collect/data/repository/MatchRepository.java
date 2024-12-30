package com.collect.data.repository;

import com.collect.data.document.Match;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class MatchRepository {

    private final MongoTemplate mongoTemplate;

    public boolean exists(String id, String collectionName) {
        Query query = new Query();
        query.addCriteria (Criteria.where("_id").is(id));
        return mongoTemplate.exists(query, collectionName);
    }

    public void save(Match match, String collectionName) {
        mongoTemplate.save(match, collectionName);
    }

    public void saveAll(List<String> matchIds, List<Match> matches, String collectionName) {
        Query query = new Query(Criteria.where("_id").in(matchIds));
        List<String> existingIds = mongoTemplate.find(query, Match.class, collectionName)
                .stream()
                .map(Match::getMatchId)
                .toList();

        List<Match> nonDuplicateMatches = matches.stream()
                .filter(match -> !existingIds.contains(match.getMatchId()))
                .collect(Collectors.toList());

        if (!nonDuplicateMatches.isEmpty()) {
            mongoTemplate.insert(nonDuplicateMatches, collectionName);
        }
    }

    public long count(String collectionName) {
        return mongoTemplate.count(new Query(), collectionName);
    }



}
