package com.lolwatcher.event.service;

import com.lolwatcher.event.client.PythonApiClient;
import com.lolwatcher.event.client.RiotApiClient;
import com.lolwatcher.event.dto.AccountDto;
import com.lolwatcher.event.dto.match.MatchDto;
import com.lolwatcher.event.dto.match.info.participant.ParticipantDto;
import com.lolwatcher.event.dto.record.RecordDto;
import com.lolwatcher.event.dto.record.RecordGameInfoDto;
import com.lolwatcher.event.dto.record.RecordUserDto;
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
        String puuid = riotApiClient.getSummonerRequest(name, tag).puuid();
        List<String> matchIds = riotApiClient.getMatchIds(puuid);
        List<MatchDto> lists = new ArrayList<>();
        for(int i = 0 ; i < 5; i++) {
            lists.add(riotApiClient.getMatchData(matchIds.get(i)));
        }
        List<RecordDto> recordList = matchDtoToRecordDto(puuid, lists);
        return lists;
    }

    private List<RecordDto> matchDtoToRecordDto(String puuid, List<MatchDto> lists) {
        List<RecordDto> list = new ArrayList<>();
        for(MatchDto matchDto : lists) {
            List<RecordUserDto> users = new ArrayList<>();
            boolean win = false;
            for(ParticipantDto participant : matchDto.info().participants()) {
                users.add(new RecordUserDto(participant.championName(), participant.summonerName(), participant.teamId(), participant.kills(), participant.assists(), participant.deaths(), participant.totalMinionsKilled()));
                if(puuid.equals(participant.puuid())) {
                    win = participant.win();
                }
            }
            RecordGameInfoDto info = new RecordGameInfoDto(matchDto.info().gameEndTimestamp(), matchDto.info().gameDuration(), win);
            list.add(new RecordDto(users, info));
        }
        return list;
    }

}
