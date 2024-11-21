package com.lolwatcher.records.controller;

import com.lolwatcher.records.dto.RecordRes;
import com.lolwatcher.records.service.RecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/records")
public class RecordController {

    private final RecordService recordService;

    @PostMapping
    public ResponseEntity<RecordRes> updateRecords(@RequestParam("name") String name, @RequestParam("tag") String tag) {
        return ResponseEntity.ok(recordService.updateRecords(name, tag));
    }

    @GetMapping
    public ResponseEntity<RecordRes> getRecords(@RequestParam("name") String name, @RequestParam("tag") String tag) {
        return ResponseEntity.ok(recordService.getRecords(name, tag));
    }
}