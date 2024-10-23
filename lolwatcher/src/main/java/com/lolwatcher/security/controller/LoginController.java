package com.lolwatcher.security.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class LoginController {

    @GetMapping("/login")
    public String login() {
        return "login";  // 로그인 페이지 템플릿을 반환
    }

    @GetMapping("/home")
    public String home() {
        return "home";  // 로그인 성공 후 이동할 페이지
    }
}
