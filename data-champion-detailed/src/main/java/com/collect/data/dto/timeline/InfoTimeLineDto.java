package com.collect.data.dto.timeline;


import com.collect.data.dto.timeline.frame.FramesTimeLineDto;

import java.util.List;

public record InfoTimeLineDto(String endOfGameResult,
                              long frameInterval,
                              long gameId,
                              List<ParticipantTimeLineDto> participants,
                              List<FramesTimeLineDto> frames) {

}
