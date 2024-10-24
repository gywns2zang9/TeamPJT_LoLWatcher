package com.lolwatcher.event.client;

import com.lolwatcher.event.config.FeignConfig;
import com.lolwatcher.event.dto.AccountDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "RiotApiClient", url = "${riot.lol.url}", configuration = FeignConfig.class)
public interface RiotApiClient {

    @RequestMapping(method = RequestMethod.GET, value = "/riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine}")
    AccountDto sendGetSummonerRequest(@PathVariable String gameName, @PathVariable String tagLine);

}
