package com.lolwatcher.event.repository;

import com.lolwatcher.event.dto.ChampionStatistics;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Objects;

@Component
@RequiredArgsConstructor
@Slf4j
public class ChampionStatRepository {

    private final MongoTemplate mongoTemplate;

    public List<ChampionStatistics> getChampionStatisticsByObjectId(String collectionName) {
        String objectId = "673ba27f991281001f2c1a71";
        Query query = new Query(Criteria.where("_id").is(new ObjectId(objectId)));
        Document document = mongoTemplate.findOne(query, Document.class, "analytics");
        if(document == null) {
            log.info("champion statistics not found");
        }
        List<Document> statsDocuments = (List<Document>) document.get(collectionName);
        if (statsDocuments == null) {
            log.info("Field '{}' not found in document with ObjectId: {}", collectionName, objectId);
            return null;
        }

        return statsDocuments.stream()
                .map(statDoc -> mongoTemplate.getConverter().read(ChampionStatistics.class, statDoc))
                .toList();
    }


}
