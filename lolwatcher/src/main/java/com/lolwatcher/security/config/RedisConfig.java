package com.lolwatcher.security.config;


import java.time.Duration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.CacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager.RedisCacheManagerBuilder;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.repository.configuration.EnableRedisRepositories;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
@EnableRedisRepositories
public class RedisConfig {    // RedisConfig 클래스를 Spring 설정 클래스로 지정하고, Redis 저장소 활성화
    // Redis 서버 호스트 주소를 application.properties 파일에서 읽어와 host 변수에 저장
    @Value("${spring.data.redis.host}")
    private String host;

    // Redis 서버 포트를 application.properties 파일에서 읽어와 port 변수에 저장
    @Value("${spring.data.redis.port}")
    private int port;

    // Redis 서버 비밀번호를 application.properties 파일에서 읽어와 redisPassword 변수에 저장
    @Value("${spring.data.redis.password}")
    private String redisPassword;


    // Redis 서버와의 연결을 위한 RedisConnectionFactory Bean 생성
    @Bean
    public RedisConnectionFactory redisConnectionFactory() {

        // Redis 서버의 호스트와 포트로 Standalone Redis 설정 생성
        RedisStandaloneConfiguration config = new RedisStandaloneConfiguration(host, port);

        // Redis 서버의 비밀번호 설정
        config.setPassword(redisPassword);

        // 비밀번호를 출력하여 확인 (로깅)
        System.out.println("Redis 비밀번호: " + redisPassword);
        
        // LettuceConnectionFactory를 사용하여 RedisConnectionFactory 인스턴스를 생성하고 반환
        return new LettuceConnectionFactory(config);

    }

    // Redis에 데이터를 저장하고 읽기 위한 RedisTemplate Bean 생성
    @Bean
    public RedisTemplate<String, Object> redisTemplate() {

        // RedisTemplate 인스턴스 생성
        RedisTemplate<String, Object> redisTemplate = new RedisTemplate<>();

        // RedisConnectionFactory를 통해 Redis 연결 설정
        redisTemplate.setConnectionFactory(redisConnectionFactory());

        // Key-Value 쌍의 Key를 문자열로 직렬화하는 Serializer 설정
        redisTemplate.setKeySerializer(new StringRedisSerializer());

        // Key-Value 쌍의 Value를 문자열로 직렬화하는 Serializer 설정
        redisTemplate.setValueSerializer(new StringRedisSerializer());


        // Hash 타입을 사용하는 경우 Key와 Value에 대해 각각 문자열 직렬화 설정
        redisTemplate.setHashKeySerializer(new StringRedisSerializer());
        redisTemplate.setHashValueSerializer(new StringRedisSerializer());


        // 모든 경우에 대해 기본 직렬화 방식을 문자열 직렬화로 설정
        redisTemplate.setDefaultSerializer(new StringRedisSerializer());

        // 구성된 RedisTemplate 인스턴스를 반환
        return redisTemplate;
    }

}
