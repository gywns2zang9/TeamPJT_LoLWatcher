package com.lolwatcher.event.dto.record;

import java.util.Map;
import java.util.List;
import java.util.Set;

public record RecordDto(List<RecordResultDto> matches, Set<RecordUserLeagueInfo> userInfo, RecordSummonerDto summoner) {
}
