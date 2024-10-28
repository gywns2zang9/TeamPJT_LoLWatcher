package com.lolwatcher.event.service;

import com.lolwatcher.event.client.RiotApiClient;
import com.lolwatcher.event.dto.AccountDto;
import com.lolwatcher.event.dto.match.MatchDto;
import com.lolwatcher.event.dto.timeline.TimelineDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RiotApiService {

    private final RiotApiClient riotApiClient;

    public AccountDto findSummonerByNameAndTag(String name, String tag) {
        return riotApiClient.getSummonerRequest(name, tag);
    }

    public List<String> findMatchList(String puuid) {
        return riotApiClient.getMatchIds(puuid);
    }

    public MatchDto findMatchDataByMatchId(String matchId) {
        return riotApiClient.getMatchData(matchId);
    }

    public TimelineDto findTimeLineDataByMatchId(String matchId) {
        return riotApiClient.getTimeLineData(matchId);
    }

}
