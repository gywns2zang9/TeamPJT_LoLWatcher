package com.lolwatcher.event.dto.record;

import java.util.List;
import java.util.Set;

public record RecordDto(List<RecordMatchDto> matches, List<RecordReportDto> reports, Set<RecordUserLeagueInfo> userInfo, RecordSummonerDto summoner) {
}
