package com.lolwatcher.event.dto.record;

import java.util.List;

public record RecordDto(List<RecordUserDto> users, RecordGameInfoDto info) {
}
