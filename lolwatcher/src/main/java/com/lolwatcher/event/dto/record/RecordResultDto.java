package com.lolwatcher.event.dto.record;

import java.util.Map;

public record RecordResultDto(RecordMatchDto match, Map<String, Object> report) {
}
