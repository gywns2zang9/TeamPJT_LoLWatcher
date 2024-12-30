package com.collect.data.dto;

public record LeagueItemDto(String summonerId,
                            boolean freshBlood,
                            boolean inactive,
                            boolean veteran,
                            boolean hotStreak,
                            String rank,
                            int leaguePoints,
                            int wins,
                            int losses) {
}
