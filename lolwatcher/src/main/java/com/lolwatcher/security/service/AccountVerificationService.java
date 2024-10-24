package com.lolwatcher.security.service;

import com.appletree.createLog.annotation.Loggable;
import com.appletree.security.dto.CodefApiReq;
import com.appletree.security.dto.CodefApiRes;
import com.appletree.security.dto.VerificationReq;
import com.appletree.security.service.client.CodefApiClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AccountVerificationService {

    private final CodefApiClient codefApiClient;
    @Loggable
    public String initiateVerification(VerificationReq req) {
        CodefApiReq codefApiReq = new CodefApiReq(
                req.getOrganization(), req.getAccount(),
                req.getInPrintType(), req.getInPrintContent()
        );

        // Codef API로 요청 전송 및 응답 수신
        CodefApiRes res = codefApiClient.sendRequest(codefApiReq);

        // 받은 인증 코드 반환
        return res.getAuthCode();
    }
}
