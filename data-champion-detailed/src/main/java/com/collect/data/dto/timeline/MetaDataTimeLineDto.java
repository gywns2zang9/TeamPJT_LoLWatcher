package com.collect.data.dto.timeline;


import java.util.List;

public record MetaDataTimeLineDto(String dataVersion,
                                  String matchId,
                                  List<String> participants) {

}
