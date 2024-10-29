package com.lolwatcher.event.client;

import com.lolwatcher.event.config.DataAnalyticFeignConfig;
import com.lolwatcher.event.config.RiotFeignConfig;
import com.lolwatcher.event.dto.match.MatchDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@FeignClient(name = "PythonApiClient", url = "${analytic.url}", configuration = DataAnalyticFeignConfig.class)
public interface PythonApiClient {

    @RequestMapping(method = RequestMethod.POST, value = "/analyze/match-data")
    void postMatchData(@RequestBody MatchDto matchData);

}