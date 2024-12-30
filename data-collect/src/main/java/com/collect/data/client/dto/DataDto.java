package com.collect.data.client.dto;

import com.collect.data.dto.match.MatchDto;
import com.collect.data.dto.timeline.TimelineDto;

public record DataDto(MatchDto matchDto, TimelineDto timelineDto) {

}
