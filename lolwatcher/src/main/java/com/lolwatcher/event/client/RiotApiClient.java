package com.lolwatcher.event.client;

import com.lolwatcher.event.config.FeignConfig;
import org.springframework.cloud.openfeign.FeignClient;

@FeignClient(name = "RiotApiClient", url = "${riot.lol.url}", configuration = FeignConfig.class)
public interface RiotApiClient {


}
