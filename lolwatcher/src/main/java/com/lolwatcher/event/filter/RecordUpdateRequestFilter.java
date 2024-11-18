package com.lolwatcher.event.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lolwatcher.event.client.RiotAsiaApiClient;
import com.lolwatcher.event.dto.AccountDto;
import com.lolwatcher.event.dto.RecordResponse;
import com.lolwatcher.event.dto.record.RecordDto;
import com.lolwatcher.event.util.RecordRequestRedisUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j
public class RecordUpdateRequestFilter extends OncePerRequestFilter {

    private final RiotAsiaApiClient riotAsiaApiClient;
    private final RecordRequestRedisUtil recordRequestRedisUtil;
    private final ObjectMapper objectMapper;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String name = request.getParameter("name");
        String tag = request.getParameter("tag");
        String puuid = request.getParameter("puuid");

        AccountDto accountDto = null;

        if (name != null && tag != null) {
            log.info("RecordUpdateRequestFilter: name={}, tag={}", name, tag);
            accountDto = riotAsiaApiClient.getSummonerRequest(name, tag);
        } else if (puuid != null) {
            log.info("RecordUpdateRequestFilter: puuid={}", puuid);
            accountDto = riotAsiaApiClient.getSummonerRequestByPuuid(puuid);
        }

        if (accountDto != null) {
            log.info("RecordUpdateRequestFilter: account = {}", accountDto);
            request.setAttribute("account", accountDto);
            int remainTime = recordRequestRedisUtil.fetchRemainingTime(accountDto.puuid());
            if (remainTime > 0) {
                RecordDto recordDto = recordRequestRedisUtil.fetchRecordDtoByPuuid(accountDto.puuid());
                RecordResponse recordResponse = new RecordResponse(remainTime, recordDto);
                response.setContentType("application/json");
                response.setCharacterEncoding("UTF-8");
                String jsonResponse = objectMapper.writeValueAsString(recordResponse);
                response.getWriter().write(jsonResponse);
                response.setStatus(HttpServletResponse.SC_OK);
                return;
            }
        } else {
            throw new IllegalArgumentException("Account not found");
        }

        filterChain.doFilter(request, response);
    }
}
