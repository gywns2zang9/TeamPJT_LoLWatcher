package com.lolwatcher.event.client;

import com.lolwatcher.event.config.DataAnalyticFeignConfig;
import com.lolwatcher.event.dto.match.MatchDto;
import feign.Response;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.List;

@FeignClient(name = "PythonApiClient", url = "${analytic.url}", configuration = DataAnalyticFeignConfig.class)
public interface PythonApiClient {

    @RequestMapping(method = RequestMethod.POST, value = "/analytic/report")
    Response postMatchData(@RequestBody List<String> matchIds);

}