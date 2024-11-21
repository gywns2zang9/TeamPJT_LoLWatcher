package com.lolwatcher.event.dto.match;

import com.lolwatcher.event.dto.match.info.InfoDto;

public record MatchDto(MetadataDto metadata, InfoDto info) {
}
