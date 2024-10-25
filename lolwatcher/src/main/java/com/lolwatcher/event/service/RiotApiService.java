package com.lolwatcher.event.service;

import com.lolwatcher.event.client.RiotApiClient;
import com.lolwatcher.event.dto.AccountDto;
import com.lolwatcher.event.dto.MatchData;
import com.lolwatcher.event.dto.TimeLineData;
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

    public MatchData findMatchDataByMatchId(String matchId) {
        return riotApiClient.getMatchData(matchId);
    }

    public TimeLineData findTimeLineDataByMatchId(String matchId) {
        return riotApiClient.getTimeLineData(matchId);
    }

}
