package com.lolwatcher.user.service;



import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.ObjectFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class UserService {

//    private final UserInfoRepository userInfoRepository;
//    private final ObjectFactory<UserService> selfFactory;  // 자기 자신을 ObjectFactory로 주입받음
//    private final JwtUtil jwtUtil;
//    private final UserAuthorizationRepository userAuthorizationRepository;
//
//
//    public UserInfoDto getUserInfo(Long userId) {
//
//        return userInfoRepository.findById(userId)
//                .map(UserInfoDto::toDto)
//                .orElseThrow(() -> new NoSuchElementException("user가 존재하지 않음"));
//
//    @Transactional
//    public ModifyRes modifyUser(Long userId, ModifyReq modifyReq) {
//        UserAuthorization userAuthorization = userAuthorizationRepository.findById(userId).orElseThrow(
//                // Todo: 찾지 못했을 때 오류 던짐
//        );
//        UserInfo userInfo = userInfoRepository.findById(userId).orElseThrow(
//                // Todo: 찾지 못했을 때 오류 던짐
//        );
//
//        ModifyReq.toEntity(modifyReq, userInfo);
//        ModifyReq.toEntity(modifyReq, userInfo);
//        String newAccessToken = jwtUtil.generateAccessToken(userId);
//        userInfo.setUserAuthorization(userAuthorization);
//        userInfoRepository.save(userInfo);
//
//        return ModifyRes.fromEntity(userInfo, newAccessToken);
//    }
}
