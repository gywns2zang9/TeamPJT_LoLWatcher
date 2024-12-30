package com.collect.data.controller;

import com.collect.data.enumeration.Division;
import com.collect.data.enumeration.Tier;
import com.collect.data.service.DataService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/data")
@RequiredArgsConstructor
public class DataController {

    private final DataService dataService;

    @PostMapping("/collect")
    public String data() throws InterruptedException, NoSuchMethodException {
        dataService.postDataByTier();
        return "tier";
    }

}
