package com.lolwatcher.security.exception;

public class TokenNotFoundException extends RuntimeException {
    public TokenNotFoundException(String message, Throwable cause) {

    }

    public TokenNotFoundException(String message) {
        super(message);
    }
}
