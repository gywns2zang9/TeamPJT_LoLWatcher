package com.collect.data.service;

import com.collect.data.client.RiotAsiaClient;
import com.collect.data.client.RiotKrClient;
import com.collect.data.dto.LeagueEntryDTO;
import com.collect.data.dto.LeagueItemDto;
import com.collect.data.dto.LeagueListDto;
import com.collect.data.dto.SummonerDTO;
import com.collect.data.dto.match.MatchDto;
import com.collect.data.dto.timeline.TimelineDto;
import com.collect.data.document.Match;
import com.collect.data.enumeration.Division;
import com.collect.data.enumeration.Tier;
import com.collect.data.repository.MatchRepository;
import feign.FeignException;
import feign.RetryableException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class DataService {

    @Value("${riot.api-key}")
    private String key;

    private final RiotAsiaClient riotAsiaClient;
    private final RiotKrClient riotKrClient;
    private final MatchRepository matchRepository;

    public void postDataByTier() throws InterruptedException {

        for(Tier tier: Tier.values()) {
            if(tier == Tier.MASTER || tier == Tier.GRANDMASTER || tier == Tier.CHALLENGER) {
                log.info("Posting data for tier {}", tier);
                saveMatchDataByTier(tier);
                log.info("Posted data for tier {}", tier);
            } else {
                for(Division division: Division.values()) {
                    log.info("Posting data for tier {} and division {}", tier, division);
                    saveMatchDataByTierAndDivision(tier, division);
                    log.info("Posted data for tier {} and division {}", tier, division);
                }
            }
        }

    }


    private void saveMatchDataByTierAndDivision(Tier tier, Division division) throws InterruptedException {
        String collectionName = makeCollectionName(tier, division);
        if(matchRepository.count(collectionName) >= 11000) {
            System.out.println(collectionName + " is Full");
            return;
        }
        Set<LeagueEntryDTO> entries = riotKrClient.getSummaryLeagueEntries(tier, division, getApiKey());
        assert entries != null;
        for(LeagueEntryDTO leagueEntryDTO : entries) {
            System.out.println(collectionName + " count: " + matchRepository.count(collectionName));
            System.out.println(leagueEntryDTO);
            saveMatchDataBySummonerId(leagueEntryDTO.summonerId(), collectionName);
            if (matchRepository.count(collectionName) >= 11000) {
                System.out.println(collectionName + " is Full");
                return;
            }
        }
    }

    private void saveMatchDataByTier(Tier tier) throws InterruptedException {
        String collectionName = tier.toString().toLowerCase();
        if(matchRepository.count(collectionName) >= 11000) {
            System.out.println(collectionName + " is Full");
            return;
        }
        LeagueListDto lists = null;
        switch (Tier.valueOf(tier.toString())) {
            case MASTER -> lists = riotKrClient.getMasterLeagues(getApiKey());
            case GRANDMASTER -> lists = riotKrClient.getGrandMasterLeagues(getApiKey());
            case CHALLENGER -> lists = riotKrClient.getChallengerLeagues(getApiKey());
        }
        assert lists != null;
        for(LeagueItemDto items : lists.entries()) {
            System.out.println(collectionName + " count: " + matchRepository.count(collectionName));
            System.out.println(items);
            saveMatchDataBySummonerId(items.summonerId(), collectionName);
            if (matchRepository.count(collectionName) >= 11000) {
                System.out.println(collectionName + " is Full");
                return;
            }
        }

    }

    private void saveMatchDataBySummonerId(String summonerId, String collectionName) throws InterruptedException {
        SummonerDTO summoner = null;
        List<String> matchIds = null;
        try {
            summoner = riotKrClient.getSummonerRequest(summonerId, getApiKey());
            matchIds = riotAsiaClient.getMatchIds(summoner.puuid(), getApiKey());
            saveMatchDataByMatchIds(matchIds, collectionName);
        } catch (FeignException e) {
            e.printStackTrace();
            if (e.status() == 404 || e.status() == 400) {
                return;
            } else if (e.status() == 503) {
                Thread.sleep(10000);
            } else if (e instanceof RetryableException) {
                Thread.sleep(1000);
            } else {
                throw e;
            }
        }
    }


    private void saveMatchDataByMatchIds(List<String> matchIds, String collectionName) throws InterruptedException {
        List<Match> matches = new ArrayList<>();
        for(String matchId : matchIds) {
            if(matchRepository.exists(matchId, collectionName)) continue;
            try {
                MatchDto matchDto = riotAsiaClient.getMatchData(matchId, getApiKey());
                if(matchDto.info().queueId() != 420 && matchDto.info().queueId() != 440) continue;
                TimelineDto timelineDto = riotAsiaClient.getTimeLineData(matchId, getApiKey());
                matches.add(new Match(matchId, matchDto, timelineDto));
                System.out.println("saved: " + matchId);
            } catch (FeignException e) {
                e.printStackTrace();
                if(e.status() == 404 || e.status() == 400) {
                    return;
                } else if(e.status() == 503) {
                    Thread.sleep(10000);
                } else if(e instanceof RetryableException) {
                    Thread.sleep(1000);
                } else {
                    throw e;
                }
            }
        }
        matchRepository.saveAll(matchIds, matches, collectionName);
    }

    private String getApiKey() throws InterruptedException {
        Thread.sleep( 25);
        return key;
    }

    private String makeCollectionName(Tier tier, Division division) {
        return tier.toString().toLowerCase() + "_" + division.toString().toLowerCase();
    }

}
