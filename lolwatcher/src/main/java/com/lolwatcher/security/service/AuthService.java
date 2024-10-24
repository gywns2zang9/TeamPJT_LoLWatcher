package com.lolwatcher.security.service;

import com.appletree.createLog.annotation.Loggable;
import com.appletree.security.dto.LoginReq;
import com.appletree.security.dto.LoginRes;
import com.appletree.security.dto.SignupReq;
import com.appletree.security.entity.UserAuthorization;
import com.appletree.security.exception.ConflictException;
import com.appletree.security.exception.NotFoundException;
import com.appletree.security.exception.UnauthorizedException;
import com.appletree.security.repository.UserAuthorizationRepository;
import com.appletree.security.util.JwtUtil;
import com.appletree.user.entity.UserInfo;
import com.appletree.user.repository.UserInfoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserAuthorizationRepository userAuthorizationRepository;
    private final UserInfoRepository userInfoRepository;
    private final JwtUtil jwtUtil;
    @Loggable
    @Transactional
    public void signup(SignupReq signupReq) {
        if (userAuthorizationRepository.findByAccount(signupReq.getAccount()).isPresent()) {
            throw new ConflictException("User already exists");
        }

        UserAuthorization userAuthorization = SignupReq.toAuthorization(signupReq);
        userAuthorizationRepository.save(userAuthorization);

        UserInfo userInfo = SignupReq.toInfo(signupReq);
        userInfo.setUserAuthorization(userAuthorization);
        userInfoRepository.save(userInfo);
    }

    @Loggable
    public LoginRes login(LoginReq loginReq) {
        // Todo
        // UserAuthorizationRepository에서 findByAccount를 이용해서 계정이 동일한 사용자 정보를 불러옴
        UserAuthorization userAuthorization = userAuthorizationRepository.findByAccount(loginReq.getAccount())
                // Todo: 존재하지 않는 사용자 오류 반환
                .orElseThrow(() -> new NotFoundException("User not found"));

        if (userAuthorization.getPassword() != loginReq.getPassword()) {
            // Todo: 아이디 또는 비밀번호가 일치하지 않습니다 오류 반환
            throw new UnauthorizedException("Invalid username or password");
        }

        // account, password가 일치한다면 userInfo를 가지고 access, refresh 토큰 생성
        UserInfo userInfo = userInfoRepository.findById(userAuthorization.getUserID()).orElseThrow(
                // Todo: 존재하지 않는 사용자 오류 반환 but 코드를 제대로 짰다면 오류 발생할 일 없음
        );

        Long userId = userInfo.getUserId();
        String accessToken = jwtUtil.generateAccessToken(userId);
        String refreshToken = jwtUtil.generateRefreshToken(userId);

        // loginRes 반환
        return LoginRes.fromEntity(userInfo, accessToken, refreshToken);
    }

    @Loggable
    public void logout(String accessToken) {
        // Todo
        // 로그인 요청시 받은 accessToken 검증, 근데 accessToken이 만료되었으면 그냥 로그아웃 처리하면 안되나??

        // 유효기간이 지난 경우 refreshToken
    }
    @Loggable
    public String createNewAccessToken(String refreshToken) {
        // Todo
        // 인자로 전달 받은 refresh의 유효성 검사
        if (jwtUtil.isExpired(refreshToken)) {
            // Todo: refresh가 만료된 경우 에러 던짐
        }

        // refresh가 유효한 경우 userId를 추출
        Long userId = jwtUtil.getUserId(refreshToken);
        
        // userId를 이용해 새로운 access 발급
        String newAccessToken = jwtUtil.generateAccessToken(userId);
        
        // 새로 발급된 access를 리턴
        return newAccessToken;
    }
}





























