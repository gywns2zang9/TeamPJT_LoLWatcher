package com.lolwatcher.event.dto;

import com.lolwatcher.event.dto.abstractDto.LOLEvent;
import com.lolwatcher.event.dto.extendDto.*;

import java.util.Map;

public enum EventType {
    LEVEL_UP(LevelUpEvent.class),
    ITEM_PURCHASED(ItemPurchasedEvent.class),
    ITEM_DESTROYED(ItemDestroyedEvent.class),
    ITEM_UNDO(ItemUndoEvent.class),
    ITEM_SOLD(ItemSoldEvent.class),
    SKILL_LEVEL_UP(SkillLevelUpEvent.class),
    CHAMPION_KILL(ChampionKillEvent.class),
    BUILDING_KILL(BuildingKillEvent.class),
    CHAMPION_SPECIAL_KILL(ChampionSpecialKillEvent.class),
    GAME_END(GameEndEvent.class),
    ELITE_MONSTER_KILL(EliteMonsterKillEvent.class),
    WARD_PLACED(WardPlacedEvent.class),
    WARD_KILL(WardKillEvent.class),
    UNKNOWN(UnknownEvent.class);

    private final Class<? extends LOLEvent> eventClass;

    EventType(Class<? extends LOLEvent> eventClass) {
        this.eventClass = eventClass;
    }

    public static EventType getEventTypeFromStr(String eventStr) {
        try {
            return EventType.valueOf(eventStr);
        } catch (IllegalArgumentException e) {
            //TODO: WARNING LOGGING
            return EventType.UNKNOWN;
        }
    }

    public LOLEvent getEventInstance(Map<String, Object> data) {
        try {
            return this.eventClass.getDeclaredConstructor(Map.class).newInstance(data);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

}
