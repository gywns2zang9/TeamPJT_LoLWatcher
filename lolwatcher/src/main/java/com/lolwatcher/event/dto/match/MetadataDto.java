package com.lolwatcher.event.dto.match;

import java.util.List;

public record MetadataDto(String dataVersion, String matchId, List<String> participants) {
}
