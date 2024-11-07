package com.lolwatcher.records.custom;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.TOO_MANY_REQUESTS)
public class TooManyReqeustsException extends RuntimeException {

    public TooManyReqeustsException(String message) {
        super(message);
    }
}