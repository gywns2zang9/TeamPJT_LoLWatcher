package com.lolwatcher.event.util;

import com.lolwatcher.event.dto.record.RecordDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;

@Component
@RequiredArgsConstructor
public class RecordRequestRedisUtil {

    private final RedisTemplate<String, RecordDto> redisTemplate;
    private final String prefix = "record_request:";

    public int fetchRemainingTime(String puuid) {
        Long remainingTime = redisTemplate.getExpire(prefix + puuid, TimeUnit.SECONDS);

        if (remainingTime == null || remainingTime <= 0) {
            return -1;
        }

        return remainingTime.intValue();
    }

    public RecordDto fetchRecordDtoByPuuid(String puuid) {
        String key = prefix + puuid;
        return redisTemplate.opsForValue().get(key);
    }

    public void updateRequestTimer(String puuid, RecordDto recordDto) {
        redisTemplate.opsForValue().set(prefix + puuid, recordDto, 120, TimeUnit.SECONDS);
    }
}
