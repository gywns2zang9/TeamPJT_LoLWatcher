package com.lolwatcher.event.dto.abstractDto;


import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.lolwatcher.event.dto.extendDto.*;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.lang.reflect.Field;
import java.util.Map;

@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        include = JsonTypeInfo.As.PROPERTY,
        property = "type",
        defaultImpl = UnknownEvent.class
)
@JsonSubTypes({
        @JsonSubTypes.Type(value = LevelUpEvent.class, name = "LEVEL_UP"),
        @JsonSubTypes.Type(value = ItemPurchasedEvent.class, name = "ITEM_PURCHASED"),
        @JsonSubTypes.Type(value = ItemDestroyedEvent.class, name = "ITEM_DESTROYED"),
        @JsonSubTypes.Type(value = ItemUndoEvent.class, name = "ITEM_UNDO"),
        @JsonSubTypes.Type(value = ItemSoldEvent.class, name = "ITEM_SOLD"),
        @JsonSubTypes.Type(value = SkillLevelUpEvent.class, name = "SKILL_LEVEL_UP"),
        @JsonSubTypes.Type(value = ChampionKillEvent.class, name = "CHAMPION_KILL"),
        @JsonSubTypes.Type(value = BuildingKillEvent.class, name = "BUILDING_KILL"),
        @JsonSubTypes.Type(value = TurretPlateDestroyedEvent.class, name = "TURRET_PLATE_DESTROYED"),
        @JsonSubTypes.Type(value = ChampionSpecialKillEvent.class, name = "CHAMPION_SPECIAL_KILL"),
        @JsonSubTypes.Type(value = GameEndEvent.class, name = "GAME_END"),
        @JsonSubTypes.Type(value = EliteMonsterKillEvent.class, name = "ELITE_MONSTER_KILL"),
        @JsonSubTypes.Type(value = WardPlacedEvent.class, name = "WARD_PLACED"),
        @JsonSubTypes.Type(value = WardKillEvent.class, name = "WARD_KILL")
})
@NoArgsConstructor
@AllArgsConstructor
public abstract class LOLEvent {

    private String type;
    private long timestamp;

    LOLEvent(Map<String, Object> data) {
        setField(data);
    }

    private void setField(Map<String, Object> data) {
        for (Map.Entry<String, Object> entry : data.entrySet()) {
            try {
                Field field = this.getClass().getDeclaredField(entry.getKey());
                field.setAccessible(true); // private 필드 접근
                field.set(this, entry.getValue());
            } catch (NoSuchFieldException | IllegalAccessException e) {
                e.printStackTrace();
                //TODO: 필드가 없거나 접근할 수 없는 경우 처리
            }
        }
    }

    public abstract boolean isParticipant(int participantId);
}
