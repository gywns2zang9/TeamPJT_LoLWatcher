package com.lolwatcher.security.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Service;

import javax.annotation.processing.Generated;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
public class User {

    @Id
    //엔티티를 데이터베이스에 저장할 때 id 필드는 따로 값을 지정하지 않아도 자동으로 증가된 값이 데이터베이스에 의해 할당
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String userId;

    @Column(nullable = false)
    private String password;


    @Column(nullable = false)
    private String riotId;

    @Column(nullable = false)
    private String riotPassword;

}
