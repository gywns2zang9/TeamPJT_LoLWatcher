package com.lolwatcher.event.document;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Map;

@Document(collection = "report")
@Getter
@Setter
@ToString
public class Record {

    @Id
    private String matchId;
    private Map<String, Object> data;

}
