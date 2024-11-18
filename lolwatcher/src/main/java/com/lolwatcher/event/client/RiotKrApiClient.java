package com.lolwatcher.event.client;

import com.lolwatcher.event.config.RiotKrFeignConfig;
import com.lolwatcher.event.dto.LeagueEntryDTO;
import com.lolwatcher.event.dto.SummonerDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.Set;

@FeignClient(name = "RiotKrApiClient", url = "${riot.lol.kr-url}", configuration = RiotKrFeignConfig.class)
public interface RiotKrApiClient {

    @RequestMapping(method = RequestMethod.GET, value = "/lol/summoner/v4/summoners/by-puuid/{encryptedPUUID}")
    SummonerDTO getSummoner(@PathVariable String encryptedPUUID);

    @RequestMapping(method = RequestMethod.GET, value = "/lol/league/v4/entries/by-summoner/{summonerId}")
    Set<LeagueEntryDTO> getLeagueInfo(@PathVariable String summonerId);


}
