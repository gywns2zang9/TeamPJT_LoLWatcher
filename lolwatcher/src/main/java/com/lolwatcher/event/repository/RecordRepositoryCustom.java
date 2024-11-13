package com.lolwatcher.event.repository;

import java.util.List;

public interface RecordRepositoryCustom {
    List<String> findNonExistingIds(List<String> ids);
}
