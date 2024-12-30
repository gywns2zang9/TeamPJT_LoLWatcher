package com.collect.data.dto;

import com.collect.data.enumeration.Tier;

import java.util.List;

public record LeagueListDto(String leagueId, List<LeagueItemDto> entries, Tier tier, String name, String queue) {
}
