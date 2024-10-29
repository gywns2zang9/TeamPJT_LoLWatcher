package com.lolwatcher.event.dto.match.info.participant.perk;

import java.util.List;

public record PerksDto(PerkStatsDto statPerks, List<PerkStyleDto> styles) {
}
