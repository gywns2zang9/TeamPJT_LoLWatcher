package com.lolwatcher.event.dto;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String puuid;
    private String gameName;  // 소환사명
    private String tagLine;   // 태그

    // DTO를 엔티티로 변환하는 정적 메서드
    public static Account from(AccountDto dto) {
        Account account = new Account();
        account.puuid = dto.puuid();
        account.gameName = dto.gameName();
        account.tagLine = dto.tagLine();
        return account;
    }
}