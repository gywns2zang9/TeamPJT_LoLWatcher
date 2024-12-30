package com.collect.data.client;

import com.collect.data.config.RiotFeignConfig;
import com.collect.data.dto.LeagueEntryDTO;
import com.collect.data.dto.LeagueListDto;
import com.collect.data.dto.SummonerDTO;
import com.collect.data.dto.match.MatchDto;
import com.collect.data.dto.timeline.TimelineDto;
import com.collect.data.enumeration.Division;
import com.collect.data.enumeration.Tier;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@FeignClient(name = "RiotKRClient", url = "${riot.kr-url}", configuration = RiotFeignConfig.class)
public interface RiotKrClient {

    @RequestMapping(method = RequestMethod.GET, value = "/lol/league/v4/entries/RANKED_SOLO_5x5/{tier}/{division}")
    Set<LeagueEntryDTO> getSummaryLeagueEntries(@PathVariable("tier") Tier tier, @PathVariable("division") Division division, @RequestHeader("X-Riot-Token") String apiKey);

    @RequestMapping(method = RequestMethod.GET, value = "/lol/summoner/v4/summoners/{summonerId}")
    SummonerDTO getSummonerRequest(@PathVariable("summonerId") String summonerId, @RequestHeader("X-Riot-Token") String apiKey);

    @RequestMapping(method = RequestMethod.GET, value = "/lol/league/v4/grandmasterleagues/by-queue/RANKED_SOLO_5x5")
    LeagueListDto getGrandMasterLeagues(@RequestHeader("X-Riot-Token") String apiKey);

    @RequestMapping(method = RequestMethod.GET, value = "/lol/league/v4/masterleagues/by-queue/RANKED_SOLO_5x5")
    LeagueListDto getMasterLeagues(@RequestHeader("X-Riot-Token") String apiKey);

    @RequestMapping(method = RequestMethod.GET, value = "/lol/league/v4/challengerleagues/by-queue/RANKED_SOLO_5x5")
    LeagueListDto getChallengerLeagues(@RequestHeader("X-Riot-Token") String apiKey);
}