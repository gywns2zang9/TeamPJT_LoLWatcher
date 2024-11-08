package com.lolwatcher.event.dto.record;

import java.util.List;
import java.util.Set;

public record RecordDto(List<RecordMatchDto> matchs, Set<RecordUserLeagueInfo> userInfo) {
}
