package com.lolwatcher.event.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lolwatcher.event.dto.record.RecordDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;

@Component
@RequiredArgsConstructor
public class RecordRequestRedisUtil {

    private final RedisTemplate<String, String> redisTemplate;
    private final String prefix = "record_request:";
    private final ObjectMapper objectMapper = new ObjectMapper();

    public int fetchRemainingTime(String puuid) {
        Long remainingTime = redisTemplate.getExpire(prefix + puuid, TimeUnit.SECONDS);

        if (remainingTime == null || remainingTime <= 0) {
            return -1;
        }

        return remainingTime.intValue();
    }

    public RecordDto fetchRecordDtoByPuuid(String puuid) {
        String key = prefix + puuid;
        try {
            return objectMapper.readValue(redisTemplate.opsForValue().get(key), RecordDto.class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    public void updateRequestTimer(String puuid, RecordDto recordDto) {
        try {
            redisTemplate.opsForValue().set(prefix + puuid, objectMapper.writeValueAsString(recordDto), 120, TimeUnit.SECONDS);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }
}
