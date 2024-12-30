package com.collect.data.service;

import com.collect.data.dto.ChampionStatistics;
import com.collect.data.enumeration.Division;
import com.collect.data.enumeration.Tier;
import com.collect.data.repository.MatchRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class DataService {

    private final MatchRepository matchRepository;

    public void analysisData() {
        Map<String, List<ChampionStatistics>> map = new HashMap<>();
        for(Tier tier: Tier.values()) {
            if(tier == Tier.MASTER || tier == Tier.GRANDMASTER || tier == Tier.CHALLENGER) {
                String collectionName = tier.toString().toLowerCase();
                map.put(collectionName, analysis(collectionName));
            } else {
                for(Division division: Division.values()) {
                    String collectionName = makeCollectionName(tier, division);
                    map.put(collectionName, analysis(collectionName));
                }
            }
        }
        matchRepository.save(map);
    }

    private List<ChampionStatistics> analysis(String collectionName) {
        log.info("Analysing Start: collection {}", collectionName);
        return matchRepository.calculateChampionDetailedStats(collectionName);
    }

    private String makeCollectionName(Tier tier, Division division) {
        return tier.toString().toLowerCase() + "_" + division.toString().toLowerCase();
    }

}
