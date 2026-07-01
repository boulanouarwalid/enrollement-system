package com.enrollement.enrollementservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class EnrollementServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(EnrollementServiceApplication.class, args);
    }
}
