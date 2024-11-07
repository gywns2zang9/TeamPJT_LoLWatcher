package com.lolwatcher.event.controller;

import com.lolwatcher.event.dto.AccountDto;
import com.lolwatcher.event.dto.match.MatchDto;
import com.lolwatcher.event.dto.match.info.InfoDto;
import com.lolwatcher.event.dto.timeline.TimelineDto;
import com.lolwatcher.event.service.RiotApiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/riot")
@RequiredArgsConstructor
@Slf4j
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

    @GetMapping("/match/data-post")
    public HttpStatus sendMatchData(@RequestParam("match") String matchId) {
        riotApiService.sendMatchDataByMatchId(matchId);
        return HttpStatus.OK;
    }

    @GetMapping("/info")
    public List<RecordDto> getMatchBySummoner(@RequestParam("name") String name, @RequestParam("tag") String tag) {
        log.info("info : 전적 조회 \n name:{} tag:{}", name, tag);
        System.out.println("info : 전적 조회 \n name : " + name + " tag : " + tag);
        return riotApiService.getMatchDataBySummoner(name, tag);
    }

    // Todo : 제대로 동작하는지 확인
    @GetMapping("/match/players")
    public InfoDto getMatchPlayersInfo(@RequestParam("match") String matchId) {
        return riotApiService.getMatchPlayersInfo(matchId);
    }

}
