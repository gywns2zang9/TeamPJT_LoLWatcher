package com.collect.data.document;

import com.collect.data.dto.match.MatchDto;
import com.collect.data.dto.timeline.TimelineDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
@AllArgsConstructor
@Getter
public class Match {

    @Id
    private String matchId;

    private MatchDto matchDto;
    private TimelineDto timelineDto;

}
