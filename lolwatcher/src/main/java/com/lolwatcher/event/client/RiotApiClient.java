package com.lolwatcher.event.client;

import com.lolwatcher.event.config.FeignConfig;
import com.lolwatcher.event.dto.AccountDto;
import com.lolwatcher.event.dto.MatchData;
import com.lolwatcher.event.dto.timeline.TimelineDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(name = "RiotApiClient", url = "${riot.lol.url}", configuration = FeignConfig.class)
public interface RiotApiClient {

    @RequestMapping(method = RequestMethod.GET, value = "/riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine}")
    AccountDto getSummonerRequest(@PathVariable String gameName, @PathVariable String tagLine);

    @RequestMapping(method = RequestMethod.GET, value = "/lol/match/v5/matches/by-puuid/{puuid}/ids?start=0&count=20")
    List<String> getMatchIds(@PathVariable String puuid);

    @RequestMapping(method = RequestMethod.GET, value = "/lol/match/v5/matches/{matchId}")
    MatchData getMatchData(@PathVariable String matchId);

    @RequestMapping(method = RequestMethod.GET, value = "/lol/match/v5/matches/{matchId}/timeline")
    TimelineDto getTimeLineData(@PathVariable String matchId);

}
