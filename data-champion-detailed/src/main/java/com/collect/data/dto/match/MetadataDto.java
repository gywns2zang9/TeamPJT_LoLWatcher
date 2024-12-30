package com.collect.data.dto.match;

import java.util.List;

public record MetadataDto(String dataVersion, String matchId, List<String> participants) {
}
