package com.lolwatcher.event.controller;

import com.lolwatcher.event.dto.AccountDto;
import com.lolwatcher.event.dto.match.MatchDto;
import com.lolwatcher.event.dto.match.info.InfoDto;
import com.lolwatcher.event.dto.record.RecordDto;
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

    @GetMapping("/info")
    public RecordDto getMatchBySummoner(@RequestParam("name") String name, @RequestParam("tag") String tag) {
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
