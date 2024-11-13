package com.lolwatcher.event.repository;

import com.lolwatcher.event.document.Record;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecordRepository extends MongoRepository<Record, String>, RecordRepositoryCustom {

}