package com.lolwatcher.event.dto.match.info.team;

public record ObjectivesDto(ObjectiveDto baron,
                            ObjectiveDto champion,
                            ObjectiveDto dragon,
                            ObjectiveDto horde,
                            ObjectiveDto inhibitor,
                            ObjectiveDto riftHerald,
                            ObjectiveDto tower) {
}
