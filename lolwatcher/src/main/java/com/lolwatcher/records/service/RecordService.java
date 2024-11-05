package com.lolwatcher.records.service;

import com.lolwatcher.records.custom.TooManyReqeustsException;
import com.lolwatcher.records.dto.RecordRes;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.concurrent.TimeUnit;

/**
 * 유저의 전적 갱신 기능을 제공하는 서비스 클래스
 */
@Service
@RequiredArgsConstructor
public class RecordService {

    private final StringRedisTemplate stringRedisTemplate;

    // Redis에서 사용할 사용자 갱신 토큰의 키 접두사
    private static final String TOKEN_KEY_PREFIX = "user:update:";
    // 갱신 제한 시간 (분 단위)
    private static final int COOLDOWN_MINUTES = 2;

    /**
     * 유저의 전적을 갱신하는 메소드
     *
     * @param userId 전적을 갱신할 유저의 ID
     * @return RecordRes 갱신 성공 메시지와 다음 갱신까지 남은 시간을 포함한 응답
     * @throws TooManyReqeustsException 제한 시간(20분) 이내에 재요청시 발생
     * @throws RuntimeException 전적 갱신 과정에서 오류 발생시
     */
    public RecordRes updateRecords(Long userId) {
        // 유저별 고유 Redis 키 생성
        String tokenKey = TOKEN_KEY_PREFIX + userId;

        // Redis에 갱신 제한 토큰 설정 시도
        // setIfAbsent: 키가 존재하지 않을 때만 새로 설정 (동시 요청 방지)
        Boolean wasSet = stringRedisTemplate.opsForValue()
                .setIfAbsent(tokenKey, "active", Duration.ofMinutes(COOLDOWN_MINUTES));

        // 이미 토큰이 있다면 (아직 제한 시간이 지나지 않은 경우)
        if (Boolean.FALSE.equals(wasSet)) {
            // 남은 제한 시간 확인
            int remainingTime = stringRedisTemplate.getExpire(tokenKey, TimeUnit.MINUTES).intValue();
            throw new TooManyReqeustsException("전적은 20분에 한 번만 갱신할 수 있습니다.");
        }

        try {
            // 실제 전적 갱신 수행
            performRecordUpdate(userId);
            // 갱신 성공시 메시지와 다음 갱신까지 대기 시간 반환
            return new RecordRes(COOLDOWN_MINUTES);
        } catch (Exception e) {
            // 갱신 실패시 제한 토큰 삭제 (재시도 가능하도록)
            stringRedisTemplate.delete(tokenKey);
            // 오류 메시지와 함께 예외 발생
            throw new RuntimeException("전적 갱신 중 오류가 발생했습니다.", e);
        }
    }

    /**
     * 실제 전적 갱신 처리를 수행하는 내부 메소드
     *
     * @param userId 전적을 갱신할 유저의 ID
     */
    private void performRecordUpdate(Long userId) {
        // Todo: 여기에 전적 갱신 로직 구현
    }
}