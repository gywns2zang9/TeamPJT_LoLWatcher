package com.lolwatcher.event.dto.timeline;

import com.lolwatcher.event.dto.timeline.frame.FramesTimeLineDto;

import java.util.List;

public record InfoTimeLineDto(String endOfGameResult, long frameInterval, long gameId, List<ParticipantTimeLineDto> participants, List<FramesTimeLineDto> frames) {

}
