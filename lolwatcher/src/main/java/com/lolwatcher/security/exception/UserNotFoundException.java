package com.lolwatcher.security.exception;

public class UserNotFoundException extends RuntimeException {

    public UserNotFoundException(String message, Throwable cause) {
        super(message);
    }

    public UserNotFoundException(String message) {
        super(message);
    }
}
