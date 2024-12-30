package com.collect.data.client;

import com.collect.data.config.RiotFeignConfig;
import com.collect.data.dto.match.MatchDto;
import com.collect.data.dto.timeline.TimelineDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@FeignClient(name = "RiotAsiaClient", url = "${riot.asia-url}", configuration = RiotFeignConfig.class)
public interface RiotAsiaClient {

    @RequestMapping(method = RequestMethod.GET, value = "/lol/match/v5/matches/by-puuid/{puuid}/ids?start=0&count=100&queue=420")
    List<String> getMatchIds(@PathVariable("puuid") String puuid, @RequestHeader("X-Riot-Token") String apiKey);

    @RequestMapping(method = RequestMethod.GET, value = "/lol/match/v5/matches/{matchId}")
    MatchDto getMatchData(@PathVariable("matchId") String matchId, @RequestHeader("X-Riot-Token") String apiKey);

    @RequestMapping(method = RequestMethod.GET, value = "/lol/match/v5/matches/{matchId}/timeline")
    TimelineDto getTimeLineData(@PathVariable("matchId") String matchId, @RequestHeader("X-Riot-Token") String apiKey);

}