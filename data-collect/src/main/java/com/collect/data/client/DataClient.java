package com.collect.data.client;

import com.collect.data.client.dto.DataDto;
import com.collect.data.config.FeignConfig;
import com.collect.data.enumeration.Division;
import com.collect.data.enumeration.Tier;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@FeignClient(name = "dataClient", url = "http://lolwatcher.com:8081", configuration = FeignConfig.class)
public interface DataClient {

    @RequestMapping(method = RequestMethod.POST, value = "/data/{tier}/{division}")
    public String postData(@PathVariable("tier") Tier tier, @PathVariable("division")Division division, @RequestBody DataDto dataDto);


}
