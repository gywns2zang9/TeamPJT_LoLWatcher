package com.collect.data;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class LolwatcherDataCollectApplication {

	public static void main(String[] args) {
		SpringApplication.run(LolwatcherDataCollectApplication.class, args);
	}

}
