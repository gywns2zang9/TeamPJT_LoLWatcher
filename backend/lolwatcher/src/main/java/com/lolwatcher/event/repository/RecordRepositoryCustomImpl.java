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
        List<Record> existingRecords = mongoTemplate.find(query, Record.class);

        List<String> existingIds = existingRecords.stream()
                .filter(record -> record.getData() != null && record.getData().containsKey("matchReport"))
                .map(Record::getMatchId)
                .toList();

        return ids.stream()
                .filter(id -> !existingIds.contains(id))
                .collect(Collectors.toList());
    }

    @Override
    public List<Record> findExistRecords(List<String> ids) {
        Query query = new Query(Criteria.where("matchId").in(ids));
        return mongoTemplate.find(query, Record.class);
    }

    @Override
    public long countExistRecords(List<String> ids) {
        Query query = new Query(Criteria.where("matchId").in(ids));
        return mongoTemplate.count(query, Record.class);
    }


}
