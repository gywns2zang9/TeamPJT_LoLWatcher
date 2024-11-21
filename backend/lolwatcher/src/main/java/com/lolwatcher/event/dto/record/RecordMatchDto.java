package com.lolwatcher.event.dto.record;

import com.lolwatcher.event.enumeration.Division;
import com.lolwatcher.event.enumeration.Tier;

import java.util.List;

public record RecordMatchDto(Tier tier, Division division, List<RecordUserDto> users, RecordGameInfoDto info) {
}
