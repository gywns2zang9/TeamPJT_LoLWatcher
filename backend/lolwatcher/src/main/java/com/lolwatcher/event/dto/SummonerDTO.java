package com.lolwatcher.event.dto;

public record SummonerDTO(String accountId,
                          int profileIconId,
                          long revisionDate,
                          String id,
                          String puuid,
                          long summonerLevel) {
}
