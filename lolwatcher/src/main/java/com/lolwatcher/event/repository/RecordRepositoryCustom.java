package com.lolwatcher.event.repository;

import com.lolwatcher.event.document.Record;

import java.util.List;

public interface RecordRepositoryCustom {
    List<String> findNonExistingIds(List<String> ids);
    List<Record> findExistRecords(List<String> ids);
    long countExistRecords(List<String> ids);
}
