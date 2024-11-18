package com.lolwatcher.event.repository;

import com.lolwatcher.event.document.ChampionStatAnalysis;
import com.lolwatcher.event.dto.ChampionStatistics;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class ChampionStatRepository {

    private final MongoTemplate mongoTemplate;

    public List<ChampionStatistics> getChampionStatisticsByObjectId(String collectionName) {
        String objectId = "673ab72aa8d7df664d13b49d";
        Query query = new Query(Criteria.where("_id").is(new ObjectId(objectId)));
        ChampionStatAnalysis championStatistics = mongoTemplate.findOne(query, ChampionStatAnalysis.class, "analytic");

        return Objects.requireNonNull(championStatistics).getData().get("collectionName");
    }


}
