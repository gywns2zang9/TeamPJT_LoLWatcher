package com.lolwatcher.event.document;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Map;

@Document(collection = "report")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class Record {

    @Id
    private String matchId;
    private Map<String, Object> data;

}
