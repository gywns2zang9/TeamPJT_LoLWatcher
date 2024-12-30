package com.collect.data.dto.timeline.frame;


import com.collect.data.dto.timeline.frame.event.EventsTimeLineDto;
import com.collect.data.dto.timeline.frame.participant.ParticipantFrameDto;

import java.util.List;
import java.util.Map;

public record FramesTimeLineDto(List<EventsTimeLineDto> events,
                                Map<Integer, ParticipantFrameDto> participantFrames,
                                int timestamp) {

}
