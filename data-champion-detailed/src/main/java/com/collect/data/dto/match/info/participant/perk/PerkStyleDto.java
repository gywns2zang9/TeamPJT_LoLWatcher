package com.collect.data.dto.match.info.participant.perk;

import java.util.List;

public record PerkStyleDto(String description,
                           List<PerkStyleSelectionDto> selections,
                           int style) {
}
