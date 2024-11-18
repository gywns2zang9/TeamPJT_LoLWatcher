package com.lolwatcher.event.document;

import com.lolwatcher.event.dto.ChampionStatistics;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ChampionStatAnalysis {

    private Map<String, List<ChampionStatistics>> data;

}
