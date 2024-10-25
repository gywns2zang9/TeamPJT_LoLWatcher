package com.lolwatcher.event.dto;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
public class MetaData {
    private String dataVersion;
    private String matchId;
    private List<String> participants;
}
