package com.lolwatcher.records.service;

import com.lolwatcher.event.dto.AccountDto;
import com.lolwatcher.event.dto.match.MatchDto;
import com.lolwatcher.event.service.RiotApiService;
import com.lolwatcher.records.custom.TooManyReqeustsException;
import com.lolwatcher.records.dto.RecordRes;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.List;
import java.util.concurrent.TimeUnit;

/**
 * 유저의 전적 갱신 기능을 제공하는 서비스 클래스
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class RecordService {

    private final StringRedisTemplate stringRedisTemplate;
    private final RiotApiService riotApiService;

    // Redis에서 사용할 사용자 갱신 토큰의 키 접두사
    private static final String TOKEN_KEY_PREFIX = "user:update:";
    // 갱신 제한 시간 (초 단위)
    private static final int COOLDOWN_SECONDS = 120;


    // name과 tag로 전적 갱신
    public RecordRes updateRecords(String name, String tag) {
        // 소환사 정보로 먼저 puuid를 가져옴
        AccountDto account = riotApiService.findSummonerByNameAndTag(name, tag);
        int remainingTime;
        // puuid로 Redis 키 생성
        String tokenKey = TOKEN_KEY_PREFIX + account.puuid();

        Boolean wasSet = stringRedisTemplate.opsForValue()
                .setIfAbsent(tokenKey, "active", Duration.ofSeconds(COOLDOWN_SECONDS));

        System.out.println(wasSet+" 토큰 확인: "+Boolean.FALSE.equals(wasSet));
        if (Boolean.FALSE.equals(wasSet)) {
            System.out.println("접속 확인");
            remainingTime = stringRedisTemplate.getExpire(tokenKey, TimeUnit.SECONDS).intValue();
            System.out.println("remainingTime 확인 "+remainingTime);
            //return new RecordRes(remainingTime);
            throw new TooManyReqeustsException("전적은 120초에 한 번만 갱신할 수 있습니다.");
        }else{
            remainingTime=COOLDOWN_SECONDS;
        }

        try {
            // 전적 갱신 수행
            performRecordUpdate(account);
            return new RecordRes(remainingTime);
            //return new RecordRes(COOLDOWN_SECONDS);
        } catch (Exception e) {
            stringRedisTemplate.delete(tokenKey);
            throw new RuntimeException("전적 갱신 중 오류가 발생했습니다.", e);
        }
    }

    public RecordRes getRecords(String name,String tag){
        AccountDto account = riotApiService.findSummonerByNameAndTag(name, tag);
        int remainingTime;
        String tokenKey = TOKEN_KEY_PREFIX + account.puuid();

        remainingTime = stringRedisTemplate.getExpire(tokenKey, TimeUnit.SECONDS).intValue();

        if (remainingTime <= 0) {
            remainingTime = 0;
        }

        return new RecordRes(remainingTime);
    }

    /**
     * 실제 전적 갱신 처리를 수행하는 내부 메소드
     */
    private void performRecordUpdate(AccountDto account) {
        try {
            // 1. puuid로 매치 목록 조회
            List<String> matchIds = riotApiService.findMatchList(account.puuid());

            // 2. 각 매치의 상세 정보 조회
            for (int i = 0; i < Math.min(matchIds.size(), 5); i++) {
                String matchId = matchIds.get(i);
                MatchDto matchData = riotApiService.findMatchDataByMatchId(matchId);
                log.info("Match data fetched: {} for summoner: {}", matchId, account.gameName());
            }

            log.info("Records updated successfully for summoner: {}", account.gameName());
        } catch (Exception e) {
            log.error("Error updating records for summoner: {}", account.gameName(), e);
            throw new RuntimeException("전적 갱신 중 오류가 발생했습니다.", e);
        }
    }
}