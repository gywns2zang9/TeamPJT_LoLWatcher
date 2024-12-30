package com.collect.data.dto.match.info.team;

import java.util.List;

public record TeamDto(List<BanDto> bans, ObjectivesDto objectives, int teamId, boolean win) {
}
