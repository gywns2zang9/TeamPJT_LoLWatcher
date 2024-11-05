package com.lolwatcher.records.controller;

import com.lolwatcher.records.dto.RecordRes;
import com.lolwatcher.records.service.RecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/records")
public class RecordController {

    private final RecordService recordService;

    @GetMapping
    public ResponseEntity<RecordRes> getRecords(@RequestParam Long userId) {
        return ResponseEntity.ok(recordService.updateRecords(userId));
    }
}