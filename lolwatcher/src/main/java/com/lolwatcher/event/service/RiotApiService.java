package com.lolwatcher.event.service;

import com.lolwatcher.event.client.PythonApiClient;
import com.lolwatcher.event.client.RiotApiClient;
import com.lolwatcher.event.dto.AccountDto;
import com.lolwatcher.event.dto.match.MatchDto;
import com.lolwatcher.event.dto.match.info.InfoDto;
import com.lolwatcher.event.dto.timeline.TimelineDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RiotApiService {

    private final RiotApiClient riotApiClient;
    private final PythonApiClient pythonApiClient;

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

    public void sendMatchDataByMatchId(String matchId) {
        MatchDto matchDto = riotApiClient.getMatchData(matchId);
        pythonApiClient.postMatchData(matchDto);
    }

    public List<MatchDto> getMatchDataBySummoner(String name, String tag) {
        List<String> matchIds = riotApiClient.getMatchIds(riotApiClient.getSummonerRequest(name, tag).puuid());
        List<MatchDto> lists = new ArrayList<>();
        for(int i = 0 ; i < 5; i++) {
            lists.add(riotApiClient.getMatchData(matchIds.get(i)));
        }
        return lists;
    }

    // Todo : 제대로 동작하는지 확인
    public InfoDto getMatchPlayersInfo(String matchId) {
        MatchDto matchData = riotApiClient.getMatchData(matchId);
        return matchData.info();
    }
}
