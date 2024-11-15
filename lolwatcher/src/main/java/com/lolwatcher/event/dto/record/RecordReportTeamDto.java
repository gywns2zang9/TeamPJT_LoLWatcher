package com.lolwatcher.event.dto.record;

import java.util.List;
import java.util.Map;

public record RecordReportTeamDto(
        Map<String, RecordReportTeamParticipantScoreDto> top,
        Map<String, RecordReportTeamParticipantScoreDto> jungle,
        Map<String, RecordReportTeamParticipantScoreDto> middle,
        Map<String, RecordReportTeamParticipantScoreDto> bottom,
        Map<String, RecordReportTeamParticipantScoreDto> utility
) {
}
