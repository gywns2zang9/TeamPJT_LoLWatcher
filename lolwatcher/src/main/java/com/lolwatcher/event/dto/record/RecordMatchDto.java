package com.lolwatcher.event.dto.record;

import java.util.List;

public record RecordMatchDto(List<RecordUserDto> users, RecordGameInfoDto info) {
}
