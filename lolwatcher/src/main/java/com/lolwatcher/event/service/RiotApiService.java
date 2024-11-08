package com.lolwatcher.event.service;

import com.lolwatcher.event.client.PythonApiClient;
import com.lolwatcher.event.client.RiotAsiaApiClient;
import com.lolwatcher.event.client.RiotKrApiClient;
import com.lolwatcher.event.dto.AccountDto;
import com.lolwatcher.event.dto.LeagueEntryDTO;
import com.lolwatcher.event.dto.SummonerDTO;
import com.lolwatcher.event.dto.match.MatchDto;
import com.lolwatcher.event.dto.match.info.InfoDto;
import com.lolwatcher.event.dto.match.info.participant.ParticipantDto;
import com.lolwatcher.event.dto.record.*;
import com.lolwatcher.event.dto.timeline.TimelineDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class RiotApiService {

    private final RiotAsiaApiClient riotAsiaApiClient;
    private final RiotKrApiClient riotKrApiClient;
    private final PythonApiClient pythonApiClient;

    public AccountDto findSummonerByNameAndTag(String name, String tag) {
        return riotAsiaApiClient.getSummonerRequest(name, tag);
    }

    public List<String> findMatchList(String puuid) {
        return riotAsiaApiClient.getMatchIds(puuid);
    }

    public MatchDto findMatchDataByMatchId(String matchId) {
        return riotAsiaApiClient.getMatchData(matchId);
    }

    public TimelineDto findTimeLineDataByMatchId(String matchId) {
        return riotAsiaApiClient.getTimeLineData(matchId);
    }

    public void sendMatchDataByMatchId(String matchId) {
        MatchDto matchDto = riotAsiaApiClient.getMatchData(matchId);
        pythonApiClient.postMatchData(matchDto);
    }

    public RecordDto getMatchDataBySummoner(String name, String tag) {
        String puuid = riotAsiaApiClient.getSummonerRequest(name, tag).puuid();
        log.info("puuid: {}", puuid);
        SummonerDTO summoner = riotKrApiClient.getSummoner(puuid);
        Set<LeagueEntryDTO> summonerInfo = riotKrApiClient.getLeagueInfo(summoner.id());
        Set<RecordUserLeagueInfo> userInfo = new HashSet<>();
        for(LeagueEntryDTO leagueEntryDTO : summonerInfo) {
            userInfo.add(new RecordUserLeagueInfo(leagueEntryDTO.queueType(), leagueEntryDTO.tier(), leagueEntryDTO.rank(), leagueEntryDTO.leaguePoint(), leagueEntryDTO.wins(), leagueEntryDTO.losses()));
        }
        List<String> matchIds = riotAsiaApiClient.getMatchIds(puuid);
        // TODO: LIST id를 기반으로 데이터 베이스 확인 후 없는 데이터들만

        List<MatchDto> lists = new ArrayList<>();
        for(int i = 0 ; i < 10; i++) {
            lists.add(riotAsiaApiClient.getMatchData(matchIds.get(i)));
        }
        return new RecordDto(matchDtoToRecordDto(puuid, lists), userInfo);
    }

    private List<RecordMatchDto> matchDtoToRecordDto(String puuid, List<MatchDto> lists) {
        List<RecordMatchDto> list = new ArrayList<>();
        for(MatchDto matchDto : lists) {
            List<RecordUserDto> users = new ArrayList<>();
            boolean win = false;
            for(ParticipantDto participant : matchDto.info().participants()) {
                users.add(new RecordUserDto(participant.championName(), participant.riotIdGameName(), participant.teamId(), participant.kills(), participant.assists(), participant.deaths(), participant.totalMinionsKilled()));
                if(puuid.equals(participant.puuid())) {
                    win = participant.win();
                }
            }
            RecordGameInfoDto info = new RecordGameInfoDto(matchDto.info().gameEndTimestamp(), matchDto.info().gameDuration(), win);
            list.add(new RecordMatchDto(users, info));
        }
        return list;
    }

    // Todo : 제대로 동작하는지 확인
    public InfoDto getMatchPlayersInfo(String matchId) {
        MatchDto matchData = riotAsiaApiClient.getMatchData(matchId);
        return matchData.info();
    }
}
