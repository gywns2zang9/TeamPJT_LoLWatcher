package com.lolwatcher.event.controller;

import com.lolwatcher.event.dto.AccountDto;
import com.lolwatcher.event.dto.match.MatchDto;
import com.lolwatcher.event.dto.timeline.TimelineDto;
import com.lolwatcher.event.service.RiotApiService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/riot")
@RequiredArgsConstructor
public class RiotApiController {

    private final RiotApiService riotApiService;

    @GetMapping("/summoner")
    public AccountDto findSummenr(@RequestParam("name") String summonerName, @RequestParam("tag") String tag) {
        return riotApiService.findSummonerByNameAndTag(summonerName, tag);
    }

    @GetMapping("/match")
    public List<String> findMatches(@RequestParam("puuid") String puuid) {
        return riotApiService.findMatchList(puuid);
    }

    @GetMapping("/match/data")
    public MatchDto findMatchData(@RequestParam("match") String matchId) {
        return riotApiService.findMatchDataByMatchId(matchId);
    }

    @GetMapping("/match/timeline")
    public TimelineDto findTimeLineData(@RequestParam("match") String matchId) {
        return riotApiService.findTimeLineDataByMatchId(matchId);
    }

}
