package com.lolwatcher.security.repository;

import com.appletree.security.entity.UserAuthorization;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserAuthorizationRepository extends JpaRepository<UserAuthorization, Long> {

    Optional<UserAuthorization> findByAccount(String account);
}
