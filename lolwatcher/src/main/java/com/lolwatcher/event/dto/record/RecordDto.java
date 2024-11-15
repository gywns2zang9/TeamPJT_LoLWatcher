package com.lolwatcher.event.dto.record;

import java.util.Map;
import java.util.List;
import java.util.Set;

public record RecordDto(List<RecordMatchDto> matches, List<Map<String, Object>> reports, Set<RecordUserLeagueInfo> userInfo, RecordSummonerDto summoner) {
}
