package com.lolwatcher.event.dto.timeline;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.util.List;

public record MetaDataTimeLineDto(String dataVersion, String matchId, List<String> participants) {

}
