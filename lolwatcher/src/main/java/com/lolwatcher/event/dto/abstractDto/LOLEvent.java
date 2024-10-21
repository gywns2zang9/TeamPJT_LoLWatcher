package com.lolwatcher.event.dto.abstractDto;


import lombok.NoArgsConstructor;

import java.lang.reflect.Field;
import java.util.Map;

@NoArgsConstructor
public abstract class LOLEvent {

    String type;
    long timestamp;

    LOLEvent(Map<String, Object> data) {
        setField(data);
    }

    private void setField(Map<String, Object> data) {
        for (Map.Entry<String, Object> entry : data.entrySet()) {
            try {
                Field field = this.getClass().getDeclaredField(entry.getKey());
                field.setAccessible(true); // private 필드에도 접근 가능하도록 설정
                field.set(this, entry.getValue());
            } catch (NoSuchFieldException | IllegalAccessException e) {
                e.printStackTrace();
                //TODO: 필드가 없거나 접근할 수 없는 경우 처리
            }
        }
    }

    public abstract boolean isParticipant(int participantId);
}
