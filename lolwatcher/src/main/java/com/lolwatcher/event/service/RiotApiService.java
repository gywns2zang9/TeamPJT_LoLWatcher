package com.lolwatcher.event.service;

import com.lolwatcher.event.client.PythonApiClient;
import com.lolwatcher.event.client.RiotAsiaApiClient;
import com.lolwatcher.event.client.RiotKrApiClient;
import com.lolwatcher.event.document.Record;
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
import com.lolwatcher.event.repository.RecordRepository;
import com.lolwatcher.event.util.RecordRequestRedisUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.util.Pair;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import javax.accessibility.AccessibleIcon;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class RiotApiService {

    private final RiotAsiaApiClient riotAsiaApiClient;
    private final RiotKrApiClient riotKrApiClient;
    private final PythonApiClient pythonApiClient;
    private final RecordRepository recordRepository;
    private final RecordRequestRedisUtil recordRequestRedisUtil;

    public RecordDto getMatchDataBySummoner(String name, String tag, AccountDto accountDto) {
        log.info("puuid: {}", accountDto.puuid());
        SummonerDTO summoner = riotKrApiClient.getSummoner(accountDto.puuid());
        Set<LeagueEntryDTO> summonerInfo = riotKrApiClient.getLeagueInfo(summoner.id());
        Set<RecordUserLeagueInfo> userInfo = new HashSet<>();
        for(LeagueEntryDTO leagueEntryDTO : summonerInfo) {
            userInfo.add(new RecordUserLeagueInfo(leagueEntryDTO.queueType(), leagueEntryDTO.tier(), leagueEntryDTO.rank(), leagueEntryDTO.leaguePoint(), leagueEntryDTO.wins(), leagueEntryDTO.losses()));
        }
        List<String> matchIds = riotAsiaApiClient.getMatchIds(accountDto.puuid());
        List<String> nonExistsMatchIds = recordRepository.findNonExistingIds(matchIds);
        if(!nonExistsMatchIds.isEmpty()) {
            HttpStatus httpStatus = matchDtoToRecordDtoAndSave(nonExistsMatchIds);
            if(httpStatus != HttpStatus.OK) {
                throw new RuntimeException("Error saving record");
            }
        }
        List<Record> recordList = recordRepository.findAllById(matchIds);
        RecordDto recordDto = new RecordDto(
                recordList
                        .stream()
                        .map(record -> {
                            return (RecordMatchDto) record.getData().get("matchResult");
                        })
                        .toList(),
                recordList
                        .stream()
                        .map(record -> {
                            return (RecordReportDto) record.getData().get("matchReport");
                        })
                        .toList(),
                userInfo,
                new RecordSummonerDto(accountDto.gameName(),
                        accountDto.tagLine(),
                        accountDto.puuid(),
                        summoner.summonerLevel(),
                        summoner.profileIconId()));
        recordRequestRedisUtil.updateRequestTimer(accountDto.puuid(), recordDto);
        return recordDto;
    }

    private HttpStatus matchDtoToRecordDtoAndSave(List<String> ids) {

        List<Record> records = new ArrayList<>();

        for (String nonExistsMatchId : ids) {
            records.add(new Record(nonExistsMatchId, new HashMap<>()));
        }
        List<RecordMatchDto> list = new ArrayList<>();
        for(Record record : records) {
            MatchDto matchDto = riotAsiaApiClient.getMatchData(record.getMatchId());
            TimelineDto timelineDto = riotAsiaApiClient.getTimeLineData(record.getMatchId());
            List<RecordUserDto> users = new ArrayList<>();
            for(ParticipantDto participant : matchDto.info().participants()) {
                SummonerDTO summoner = riotKrApiClient.getSummoner(participant.puuid());
                Set<LeagueEntryDTO> summonerInfo = riotKrApiClient.getLeagueInfo(summoner.id());
                Tier tier = Tier.UNRANKED; Division division = Division.I;
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
                    if(summonerInfo != null && !summonerInfo.isEmpty()) {
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
            }
            Pair<Tier, Division> avgRank = fetchAvgTierAndDivision(users);
            RecordGameInfoDto info = new RecordGameInfoDto(
                    avgRank.getFirst(),
                    avgRank.getSecond(),
                    matchDto.info().teams().get(0).win() ? matchDto.info().teams().get(0).teamId() : matchDto.info().teams().get(1).teamId(),
                    matchDto.info().gameEndTimestamp(),
                    matchDto.info().gameDuration());
            record.getData().put("matchResult", new RecordMatchDto(avgRank.getFirst(), avgRank.getSecond(), users, info));
            record.getData().put("matchDto", matchDto);
            record.getData().put("timelineDto", timelineDto);
        }
        recordRepository.saveAll(records);
        return pythonApiClient.postMatchData(ids);
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
            Tier tier = recordUserDto.tier();
            Division division = recordUserDto.division();
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
