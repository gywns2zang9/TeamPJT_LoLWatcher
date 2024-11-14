package com.lolwatcher.event.dto.record;

import java.util.List;
import java.util.Map;

public record RecordReportTeamDto(
        List<Map<String, RecordReportTeamParticipantScoreDto>> top
        ,List<Map<String, RecordReportTeamParticipantScoreDto>> jungle
        ,List<Map<String, RecordReportTeamParticipantScoreDto>> middle
        ,List<Map<String, RecordReportTeamParticipantScoreDto>> bottom
        ,List<Map<String, RecordReportTeamParticipantScoreDto>> utility
) {
}
