package com.lolwatcher.security.exception;

public class TokenExpiredException extends RuntimeException {
    public TokenExpiredException(String message, Throwable cause) {
        super(message, cause);
    }

    public TokenExpiredException(String message) {
        super(message);
    }
}
