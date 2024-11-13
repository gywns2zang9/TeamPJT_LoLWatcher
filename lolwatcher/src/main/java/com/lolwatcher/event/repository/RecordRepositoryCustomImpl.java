package com.lolwatcher.event.repository;

import com.lolwatcher.event.document.Record;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class RecordRepositoryCustomImpl implements RecordRepositoryCustom {

    private final MongoTemplate mongoTemplate;

    @Override
    public List<String> findNonExistingIds(List<String> ids) {
        Query query = new Query(Criteria.where("matchId").in(ids));
        List<String> existingIds = mongoTemplate.find(query, Record.class)
                .stream()
                .map(Record::getMatchId)
                .toList();

        return ids.stream()
                .filter(id -> !existingIds.contains(id))
                .collect(Collectors.toList());
    }

}
