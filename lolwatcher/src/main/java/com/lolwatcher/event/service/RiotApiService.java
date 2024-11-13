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
import com.lolwatcher.event.enumeration.Division;
import com.lolwatcher.event.enumeration.Tier;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;

import javax.accessibility.AccessibleIcon;
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
        AccountDto accountDto = riotAsiaApiClient.getSummonerRequest(name, tag);
        log.info("puuid: {}", accountDto.puuid());
        SummonerDTO summoner = riotKrApiClient.getSummoner(accountDto.puuid());
        Set<LeagueEntryDTO> summonerInfo = riotKrApiClient.getLeagueInfo(summoner.id());
        Set<RecordUserLeagueInfo> userInfo = new HashSet<>();
        for(LeagueEntryDTO leagueEntryDTO : summonerInfo) {
            userInfo.add(new RecordUserLeagueInfo(leagueEntryDTO.queueType(), leagueEntryDTO.tier(), leagueEntryDTO.rank(), leagueEntryDTO.leaguePoint(), leagueEntryDTO.wins(), leagueEntryDTO.losses()));
        }
        List<String> matchIds = riotAsiaApiClient.getMatchIds(accountDto.puuid());

        List<MatchDto> lists = new ArrayList<>();
        for(int i = 0 ; i < 10; i++) {
            lists.add(riotAsiaApiClient.getMatchData(matchIds.get(i)));
        }
        return new RecordDto(matchDtoToRecordDto(accountDto.puuid(), lists), userInfo, new RecordSummonerDto(accountDto.gameName(), accountDto.tagLine(), accountDto.puuid(), summoner.summonerLevel(), summoner.profileIconId()));
    }

    private List<RecordMatchDto> matchDtoToRecordDto(String puuid, List<MatchDto> lists) {
        List<RecordMatchDto> list = new ArrayList<>();
        for(MatchDto matchDto : lists) {
            List<RecordUserDto> users = new ArrayList<>();
            boolean win = false;
            for(ParticipantDto participant : matchDto.info().participants()) {
                SummonerDTO summoner = riotKrApiClient.getSummoner(participant.puuid());
                Set<LeagueEntryDTO> summonerInfo = riotKrApiClient.getLeagueInfo(summoner.id());
                 Tier tier = null; Division division = null;
                if(matchDto.info().queueId() == 420) {
                    for(LeagueEntryDTO leagueEntryDTO : summonerInfo) {
                        if(leagueEntryDTO.queueType().equals("RANKED_SOLO_5x5")) {
                            tier = leagueEntryDTO.tier();
                            division = leagueEntryDTO.rank();
                        }
                    }
                } else if(matchDto.info().queueId() == 440) {
                    for(LeagueEntryDTO leagueEntryDTO : summonerInfo) {
                        if(leagueEntryDTO.queueType().equals("RANKED_FLEX_SR")) {
                            tier = leagueEntryDTO.tier();
                            division = leagueEntryDTO.rank();
                        }
                    }
                } else {
                    if(summonerInfo == null || summonerInfo.isEmpty()) {
                        tier = Tier.UNRANKED;
                        division = Division.I;
                    } else {
                        Tier tier1 = Tier.UNRANKED;
                        Division division1 = Division.I;

                        for (LeagueEntryDTO leagueEntryDTO : summonerInfo) {
                            Tier currentTier = leagueEntryDTO.tier();
                            Division currentDivision = leagueEntryDTO.rank();

                            if (customCompareTo(currentTier, currentDivision, tier1, division1) > 0) {
                                tier1 = currentTier;
                                division1 = currentDivision;
                            }
                        }
                        tier = tier1;
                        division = division1;
                    }
                }

                users.add(new RecordUserDto(participant.championName(), participant.riotIdGameName(), participant.puuid(), tier, division, participant.teamId(), participant.kills(), participant.assists(), participant.deaths(), participant.totalMinionsKilled()));
                if(puuid.equals(participant.puuid())) {
                    win = participant.win();
                }
            }
            RecordGameInfoDto info = new RecordGameInfoDto(matchDto.info().gameEndTimestamp(), matchDto.info().gameDuration(), win);
            Pair<Tier, Division> avgRank = fetchAvgTierAndDivision(users);
            list.add(new RecordMatchDto(avgRank.getFirst(), avgRank.getSecond(), users, info));
        }
        return list;
    }

    public int customCompareTo(Tier tier1, Division division1, Tier tier2, Division division2) {
        if(tier1 != tier2) {
            return tier1.compareTo(tier2);
        } else {
            return division1.compareTo(division2);
        }
    }

    public Pair<Tier, Division> fetchAvgTierAndDivision(List<RecordUserDto> users) {
        double sum = 0;
        int count = 0;
        for(RecordUserDto recordUserDto : users) {
            if(recordUserDto.tier() == Tier.UNRANKED) continue;
            Tier tier = Tier.CHALLENGER;
            Division division = Division.I;
            sum += tier.ordinal() * 4 + division.ordinal();
            count++;
        }
        if(count == 0 ) return Pair.of(Tier.UNRANKED, Division.I);
        int avg = (int) Math.round(sum / count);
        if(avg / 4 >= Tier.MASTER.ordinal()) {
            return Pair.of(Tier.fromOrdinal(avg/4), Division.I);
        }
        return Pair.of(Tier.fromOrdinal(avg/4), Division.fromOrdinal(avg%4));
    }

    // Todo : 제대로 동작하는지 확인
    public InfoDto getMatchPlayersInfo(String matchId) {
        MatchDto matchData = riotAsiaApiClient.getMatchData(matchId);
        return matchData.info();
    }
}
