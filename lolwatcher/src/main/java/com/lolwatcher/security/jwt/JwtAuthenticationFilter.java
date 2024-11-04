package com.lolwatcher.security.jwt;
import com.lolwatcher.security.jwt.JwtTokenProvider;
import com.lolwatcher.security.service.CustomUserDetailsService;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    // Logger for logging
    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private final JwtTokenProvider jwtTokenProvider;
    private final CustomUserDetailsService customUserDetailsService;
    private final ConcurrentHashMap<Long, UserDetails> userCache;

    // Constructor to inject dependencies
    public JwtAuthenticationFilter(JwtTokenProvider jwtTokenProvider, CustomUserDetailsService customUserDetailsService, ConcurrentHashMap<Long, UserDetails> userCache) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.customUserDetailsService = customUserDetailsService;
        this.userCache = userCache;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        //System.out.println("JwtAuthenticationFilter - Processing request");
        System.out.println("process 2 - JwtAuthenticationFilter");
        // Extract the JWT token from the Authorization header
        String token = jwtTokenProvider.resolveToken(request);

        try {
            if (token != null && jwtTokenProvider.validateToken(token)) {
                // Extract the user ID from the token
                Long userId = jwtTokenProvider.getUserId(token);

                // Try to get UserDetails from cache
                UserDetails userDetails = userCache.get(userId);

                if (userDetails == null) {
                    // If not in cache, load from database
                    String username = jwtTokenProvider.getUserName(token);
                    userDetails = customUserDetailsService.loadUserByUsername(username);
                    userCache.put(userId, userDetails); // Cache the user details
                }

                // Create an authentication token with the user details
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // Set the authentication in the security context
                SecurityContextHolder.getContext().setAuthentication(authentication);

                // Log the successful token validation
                logger.info("Access token is valid for user: {}", userDetails.getUsername());
            }
        } catch (ExpiredJwtException e) {
            // Log the expired token exception
            logger.warn("Access token has expired: {}", e.getMessage());
        } catch (JwtException e) {
            // Log any other token-related exceptions
            logger.error("Invalid access token: {}", e.getMessage());
        }

        // Proceed with the filter chain
        chain.doFilter(request, response);
    }
}