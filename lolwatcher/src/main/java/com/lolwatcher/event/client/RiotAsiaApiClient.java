package com.lolwatcher.event.client;

import com.lolwatcher.event.config.RiotAsiaFeignConfig;
import com.lolwatcher.event.dto.AccountDto;
import com.lolwatcher.event.dto.match.MatchDto;
import com.lolwatcher.event.dto.timeline.TimelineDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(name = "RiotAsiaApiClient", url = "${riot.lol.asia-url}", configuration = RiotAsiaFeignConfig.class)
public interface RiotAsiaApiClient {

    @RequestMapping(method = RequestMethod.GET, value = "/riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine}")
    AccountDto getSummonerRequest(@PathVariable String gameName, @PathVariable String tagLine);

    @RequestMapping(method = RequestMethod.GET, value = "/lol/match/v5/matches/by-puuid/{puuid}/ids?start=0&count=20")
    List<String> getMatchIds(@PathVariable String puuid);

    @RequestMapping(method = RequestMethod.GET, value = "/lol/match/v5/matches/{matchId}")
    MatchDto getMatchData(@PathVariable String matchId);

    @RequestMapping(method = RequestMethod.GET, value = "/lol/match/v5/matches/{matchId}/timeline")
    TimelineDto getTimeLineData(@PathVariable String matchId);

}
